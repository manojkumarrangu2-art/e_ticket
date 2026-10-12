import { Booking } from '../types';
import { formatCurrency, formatDate } from './formatters';

/**
 * Triggers the browser print dialog formatted for ticketing passes
 */
export function printTicket(): void {
  window.print();
}

/**
 * Generates an offline HTML/SVG download pass file that can be opened and printed anywhere
 */
export function downloadTicketAsDocument(booking: Booking, qrDataUrl: string): void {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TicketEase Pass - ${booking.id}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f1f5f9;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .ticket {
      width: 680px;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5, #9333ea);
      color: white;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .badge {
      background: rgba(255,255,255,0.2);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .body {
      padding: 32px;
    }
    .event-title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .category {
      display: inline-block;
      background: #e0e7ff;
      color: #4338ca;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }
    .label {
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .val {
      font-size: 16px;
      color: #1e293b;
      font-weight: 600;
    }
    .divider {
      border-top: 2px dashed #cbd5e1;
      margin: 24px 0;
      position: relative;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      padding: 24px 32px;
      border-top: 1px solid #e2e8f0;
    }
    .qr {
      width: 120px;
      height: 120px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      background: white;
      padding: 6px;
    }
    .ref {
      font-family: monospace;
      font-size: 18px;
      font-weight: 700;
      color: #4f46e5;
    }
    .notice {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 8px;
    }
    @media print {
      body { background: white; padding: 0; }
      .ticket { box-shadow: none; border: 1px solid #ccc; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div class="brand">TicketEase</div>
      <div class="badge">${booking.status} • DEMO PASS</div>
    </div>
    <div class="body">
      <span class="category">${booking.eventCategory}</span>
      <h1 class="event-title">${booking.eventTitle}</h1>
      <div class="grid">
        <div>
          <div class="label">Date & Time</div>
          <div class="val">${formatDate(booking.eventDate)} • ${booking.eventTime}</div>
        </div>
        <div>
          <div class="label">Venue & Location</div>
          <div class="val">${booking.venue}, ${booking.city}</div>
        </div>
        <div>
          <div class="label">Ticket Category & Tier</div>
          <div class="val">${booking.tierName} (${booking.ticketQuantity} ${booking.ticketQuantity === 1 ? 'Seat' : 'Seats'})</div>
        </div>
        <div>
          <div class="label">Attendee Name</div>
          <div class="val">${booking.attendee.fullName}</div>
        </div>
        <div>
          <div class="label">Total Amount Paid</div>
          <div class="val" style="color: #10b981; font-size: 18px;">${formatCurrency(booking.totalAmount)}</div>
        </div>
        <div>
          <div class="label">Payment Mode</div>
          <div class="val">${booking.paymentMethod}</div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <div>
        <div class="label">Booking Reference ID</div>
        <div class="ref">${booking.id}</div>
        <div class="label" style="margin-top: 10px;">Payment Ref</div>
        <div style="font-family: monospace; font-size: 13px; color: #64748b;">${booking.paymentId}</div>
        <div class="notice">Present this digital pass or QR at security gate for entry scanning.</div>
      </div>
      <div>
        ${qrDataUrl ? `<img class="qr" src="${qrDataUrl}" alt="QR Pass" />` : ''}
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      // Auto-focus print if opened in separate tab
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TicketEase-Pass-${booking.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
