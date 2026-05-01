import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ──────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────
interface OrderRecord {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  customer_name: string;
  phone: string;
  location: string;
  created_at?: string;
}

interface SupabaseWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: OrderRecord;
  old_record: OrderRecord | null;
}

// ──────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────
function buildEmailHtml(order: OrderRecord): string {
  const orderedAt = order.created_at
    ? new Date(order.created_at).toLocaleString("en-NP", {
        timeZone: "Asia/Kathmandu",
        dateStyle: "full",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-NP", {
        timeZone: "Asia/Kathmandu",
        dateStyle: "full",
        timeStyle: "short",
      });

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Order – RC Toys Nepal</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; font-family: 'Segoe UI', Arial, sans-serif; color: #e0e0e0; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #12121a; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a3a; }
    .header { background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 36px 40px; text-align: center; }
    .header-icon { font-size: 48px; margin-bottom: 12px; }
    .header h1 { font-size: 26px; font-weight: 700; color: #fff; letter-spacing: 0.5px; }
    .header p { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 6px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-top: 14px; }
    .body { padding: 36px 40px; }
    .section-title { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #e53e3e; margin-bottom: 16px; }
    .card { background: #1a1a2e; border: 1px solid #2a2a3a; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .field { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #2a2a3a; }
    .field:last-child { border-bottom: none; padding-bottom: 0; }
    .field:first-child { padding-top: 0; }
    .field-icon { font-size: 18px; flex-shrink: 0; width: 28px; text-align: center; margin-top: 1px; }
    .field-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #888; margin-bottom: 3px; }
    .field-value { font-size: 15px; color: #e0e0e0; font-weight: 500; word-break: break-all; }
    .order-id-value { font-size: 12px; color: #a0a0b0; font-family: monospace; }
    .highlight-card { background: linear-gradient(135deg, rgba(229,62,62,0.12) 0%, rgba(197,48,48,0.08) 100%); border: 1px solid rgba(229,62,62,0.3); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; }
    .highlight-card .product-name { font-size: 20px; font-weight: 700; color: #fff; }
    .highlight-card .product-slug { font-size: 12px; color: #888; margin-top: 4px; font-family: monospace; }
    .footer { background: #0a0a0f; border-top: 1px solid #2a2a3a; padding: 24px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #555; line-height: 1.6; }
    .footer strong { color: #e53e3e; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #2a2a3a 20%, #2a2a3a 80%, transparent); margin: 4px 0 24px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- HEADER -->
    <div class="header">
      <div class="header-icon">🛒</div>
      <h1>New Order Received!</h1>
      <p>Someone just placed an order on your store</p>
      <span class="badge">RC Toys Nepal</span>
    </div>

    <!-- BODY -->
    <div class="body">
      <p class="section-title">Product</p>
      <div class="highlight-card">
        <div class="product-name">${escapeHtml(order.product_name)}</div>
        <div class="product-slug">/${escapeHtml(order.product_slug)}</div>
      </div>

      <p class="section-title">Customer Details</p>
      <div class="card">
        <div class="field">
          <div class="field-icon">👤</div>
          <div>
            <div class="field-label">Customer Name</div>
            <div class="field-value">${escapeHtml(order.customer_name)}</div>
          </div>
        </div>
        <div class="field">
          <div class="field-icon">📞</div>
          <div>
            <div class="field-label">Phone</div>
            <div class="field-value">${escapeHtml(order.phone)}</div>
          </div>
        </div>
        <div class="field">
          <div class="field-icon">📍</div>
          <div>
            <div class="field-label">Location</div>
            <div class="field-value">${escapeHtml(order.location)}</div>
          </div>
        </div>
      </div>

      <p class="section-title">Order Meta</p>
      <div class="card">
        <div class="field">
          <div class="field-icon">🗓️</div>
          <div>
            <div class="field-label">Ordered At</div>
            <div class="field-value">${orderedAt}</div>
          </div>
        </div>
        <div class="field">
          <div class="field-icon">🔖</div>
          <div>
            <div class="field-label">Order ID</div>
            <div class="order-id-value">${escapeHtml(order.id)}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>This notification was sent automatically by <strong>RC Toys Nepal</strong>.</p>
      <p>Log in to your admin panel to manage orders.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ──────────────────────────────────────────────────
// Route Handler
// ──────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Verify the shared webhook secret (set this in Supabase webhook headers)
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (webhookSecret) {
    const authHeader = request.headers.get("x-webhook-secret");
    if (authHeader !== webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // 2. Parse the webhook payload
  let payload: SupabaseWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 3. Only act on INSERT events on the orders table
  if (payload.type !== "INSERT" || payload.table !== "orders") {
    return NextResponse.json({ message: "Ignored: not an orders INSERT" }, { status: 200 });
  }

  const order = payload.record;
  if (!order || !order.id) {
    return NextResponse.json({ error: "Missing order record" }, { status: 400 });
  }

  // 4. Send email via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL;
  const fromEmail = process.env.FROM_EMAIL ?? "orders@rctoysnepal.com";

  if (!resendApiKey || !ownerEmail) {
    console.error("[notify-order] Missing RESEND_API_KEY or OWNER_EMAIL env vars");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);

  const subject = `🛒 New Order: ${order.product_name} — ${order.customer_name}`;

  const { data, error } = await resend.emails.send({
    from: `RC Toys Nepal Orders <${fromEmail}>`,
    to: [ownerEmail],
    subject,
    html: buildEmailHtml(order),
  });

  if (error) {
    console.error("[notify-order] Resend error:", error);
    return NextResponse.json({ error: "Failed to send email", details: error }, { status: 500 });
  }

  console.log("[notify-order] Email sent:", data?.id);
  return NextResponse.json({ success: true, emailId: data?.id }, { status: 200 });
}
