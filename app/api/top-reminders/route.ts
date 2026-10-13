import { NextResponse } from "next/server";
import { calculateAging } from "@/lib/utils";
import { MOCK_INVOICES } from "@/lib/mock-data";

/**
 * Endpoint Cron Job untuk Otomasi Pengingat TOP (Term of Payment)
 * Dapat dipanggil secara berkala (misal: setiap hari pukul 08:00 WIB via Vercel Cron / GitHub Actions)
 */
export async function GET(request: Request) {
  try {
    const today = new Date();
    const remindersSent = [];

    for (const inv of MOCK_INVOICES) {
      if (inv.status === "PAID") continue;

      const aging = calculateAging(inv.dueDate);
      const daysOverdue = aging.daysOverdue;

      let actionTaken = null;

      if (daysOverdue === -7) {
        actionTaken = "REMINDER_H_7_FRIENDLY_EMAIL";
      } else if (daysOverdue === -3) {
        actionTaken = "REMINDER_H_3_CLEARING_CONFIRMATION";
      } else if (daysOverdue === 0) {
        actionTaken = "REMINDER_H_0_DUE_DATE_ALERT";
      } else if (daysOverdue > 45) {
        actionTaken = "OVERDUE_CRITICAL_LEGAL_ESCALATION";
      } else if (daysOverdue > 0) {
        actionTaken = "OVERDUE_REGULAR_FOLLOWUP";
      }

      if (actionTaken) {
        remindersSent.push({
          invoiceNumber: inv.invoiceNumber,
          customerName: inv.customerName,
          balanceAmount: inv.balanceAmount,
          topDays: inv.topDays,
          daysOverdue,
          actionTaken,
          timestamp: today.toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cron job TOP Reminder selesai diproses. ${remindersSent.length} notifikasi disalurkan.`,
      executedAt: today.toISOString(),
      remindersSent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
