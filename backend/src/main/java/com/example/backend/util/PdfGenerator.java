// package com.example.backend.util;

// import org.apache.pdfbox.pdmodel.PDDocument;
// import org.apache.pdfbox.pdmodel.PDPage;
// import org.apache.pdfbox.pdmodel.PDPageContentStream;
// import org.apache.pdfbox.pdmodel.common.PDRectangle;
// import org.apache.pdfbox.pdmodel.font.PDType1Font;

// import java.io.ByteArrayOutputStream;

// public class PdfGenerator {

//   public static byte[] simpleTextPdf(String title, String body) {
//     try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
//       PDPage page = new PDPage(PDRectangle.A4);
//       doc.addPage(page);

//       try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
//         cs.beginText();
//         cs.setFont(PDType1Font.HELVETICA_BOLD, 18);
//         cs.newLineAtOffset(50, 780);
//         cs.showText(title);
//         cs.endText();

//         cs.beginText();
//         cs.setFont(PDType1Font.HELVETICA, 12);
//         cs.newLineAtOffset(50, 750);
//         for (String line : body.split("\n")) {
//           cs.showText(line);
//           cs.newLineAtOffset(0, -16);
//         }
//         cs.endText();
//       }

//       doc.save(out);
//       return out.toByteArray();
//     } catch (Exception e) {
//       throw new RuntimeException("Failed generate PDF", e);
//     }
//   }
// }
