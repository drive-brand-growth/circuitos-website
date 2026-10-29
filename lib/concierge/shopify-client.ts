/**
 * Shopify Read Client — Phase 0
 *
 * Read-only. Uses the Admin REST API.
 * Env vars required: SHOPIFY_SHOP_DOMAIN, SHOPIFY_ACCESS_TOKEN
 *
 * Falls back to realistic mock data when credentials are absent,
 * so the concierge is functional before the store is fully wired.
 * Mock data is clearly labeled in the response (is_mock: true).
 */

import type { ShopifyOrder, ShopifySummary } from './types';

const SHOPIFY_API_VERSION = '2024-01';

// Realistic mock orders matching the MetroFlex Apparel catalog
const MOCK_ORDERS: ShopifyOrder[] = [
  {
    id: 'mock-1001',
    order_number: 1001,
    created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    financial_status: 'paid',
    fulfillment_status: null,
    total_price: '45.00',
    line_items: [{ name: 'MetroFlex Heritage Tee — Black / L', quantity: 2, price: '22.50' }],
    shipping_address: { city: 'Dallas', province: 'TX' },
  },
  {
    id: 'mock-1002',
    order_number: 1002,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    financial_status: 'paid',
    fulfillment_status: 'fulfilled',
    total_price: '32.00',
    line_items: [{ name: 'MetroFlex Snapback Cap — Red', quantity: 1, price: '32.00' }],
    shipping_address: { city: 'Houston', province: 'TX' },
  },
  {
    id: 'mock-1003',
    order_number: 1003,
    created_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    financial_status: 'paid',
    fulfillment_status: null,
    total_price: '90.00',
    line_items: [
      { name: 'MetroFlex Heritage Tee — White / XL', quantity: 2, price: '22.50' },
      { name: 'MetroFlex Snapback Cap — Black', quantity: 1, price: '32.00' },
    ],
    shipping_address: { city: 'San Antonio', province: 'TX' },
  },
  {
    id: 'mock-1004',
    order_number: 1004,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    financial_status: 'paid',
    fulfillment_status: 'fulfilled',
    total_price: '67.50',
    line_items: [{ name: 'MetroFlex Heritage Tee — Black / M', quantity: 3, price: '22.50' }],
    shipping_address: { city: 'Austin', province: 'TX' },
  },
  {
    id: 'mock-1005',
    order_number: 1005,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    financial_status: 'paid',
    fulfillment_status: 'fulfilled',
    total_price: '22.50',
    line_items: [{ name: 'MetroFlex Heritage Tee — Red / S', quantity: 1, price: '22.50' }],
    shipping_address: { city: 'Fort Worth', province: 'TX' },
  },
];

async function shopifyFetch<T>(
  shopDomain: string,
  accessToken: string,
  endpoint: string,
): Promise<T> {
  const url = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Shopify API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

function sumRevenue(orders: ShopifyOrder[]): number {
  return orders.reduce((acc, o) => acc + parseFloat(o.total_price), 0);
}

export async function getOrderSummary(): Promise<ShopifySummary> {
  const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();

  if (!shopDomain || !accessToken) {
    const unfulfilled = MOCK_ORDERS.filter(
      (o) => o.fulfillment_status === null && o.financial_status === 'paid',
    );
    const todayOrders = MOCK_ORDERS.filter((o) => now - new Date(o.created_at).getTime() < DAY);
    const sevenDayOrders = MOCK_ORDERS.filter(
      (o) => now - new Date(o.created_at).getTime() < 7 * DAY,
    );
    return {
      orders: MOCK_ORDERS,
      unfulfilled,
      revenue_today: sumRevenue(todayOrders),
      revenue_7day: sumRevenue(sevenDayOrders),
      revenue_month: sumRevenue(MOCK_ORDERS),
      order_count_today: todayOrders.length,
      order_count_7day: sevenDayOrders.length,
      order_count_month: MOCK_ORDERS.length,
      is_mock: true,
    };
  }

  const since30d = new Date(now - 30 * DAY).toISOString();
  const { orders } = await shopifyFetch<{ orders: ShopifyOrder[] }>(
    shopDomain,
    accessToken,
    `orders.json?status=any&created_at_min=${since30d}&limit=250`,
  );

  const unfulfilled = orders.filter(
    (o) => o.fulfillment_status === null && o.financial_status === 'paid',
  );
  const todayOrders = orders.filter((o) => now - new Date(o.created_at).getTime() < DAY);
  const sevenDayOrders = orders.filter((o) => now - new Date(o.created_at).getTime() < 7 * DAY);

  return {
    orders,
    unfulfilled,
    revenue_today: sumRevenue(todayOrders),
    revenue_7day: sumRevenue(sevenDayOrders),
    revenue_month: sumRevenue(orders),
    order_count_today: todayOrders.length,
    order_count_7day: sevenDayOrders.length,
    order_count_month: orders.length,
    is_mock: false,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
