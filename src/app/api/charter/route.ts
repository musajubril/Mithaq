import { NextResponse } from "next/server";
import { getCharterData } from "@/app/actions/charter";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export async function GET() {
  const data = await getCharterData();

  if ("error" in data) {
    return NextResponse.json(
      { error: data.error, message: "Could not generate covenant data." }, 
      { status: 400 }
    );
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          body { font-family: 'serif'; padding: 50px; color: #1a1a1a; }
          h1 { text-align: center; font-size: 32px; font-style: italic; color: #4a5d4e; }
          .header { text-align: center; margin-bottom: 50px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .couple { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          .answer-row { margin-bottom: 20px; page-break-inside: avoid; }
          .question { font-style: italic; font-weight: bold; margin-bottom: 5px; }
          .values { display: flex; gap: 20px; font-size: 14px; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Mithaq (مِيثَاق)</h1>
          <p>The Sacred Contract of Intention</p>
          <div class="couple">${data.userName} & ${data.partnerName}</div>
          <p>${new Date().toLocaleDateString()}</p>
        </div>

        ${data.sharedAnswers.map(a => `
          <div class="answer-row">
            <div class="question">${a.question}</div>
            <div class="values">
              <div>${data.userName}: ${a.userValue}</div>
              <div>${data.partnerName}: ${a.partnerValue}</div>
            </div>
          </div>
        `).join('')}

        <div class="footer">
          Generated with intentionality by Mithaq (مِيثَاق).
        </div>
      </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754 }, // A4 at 150dpi
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    return new Response(pdf as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=Mithaq-Charter.pdf",
      },
    });
  } catch (error) {
    console.error("PDF Export Error:", error);
    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }
}
