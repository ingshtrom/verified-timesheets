//
//  HTMLToPDFGenerator.swift
//  VerifiedTimesheets
//
//  Created by Alex Hokanson on 4/4/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation

class PDFGenerator {
  // input <- html
  // output -> path to pdf
  class func fromHTML (html: String, pathToPDF: String) {
    // Thanks to https://gist.github.com/nyg/b8cd742250826cb1471f
    // Thanks to http://www.labs.saachitech.com/2012/10/23/pdf-generation-using-uiprintpagerenderer
  
    // 1. Create a print formatter
    let fmt = UIMarkupTextPrintFormatter(markupText: html)
  
    // 2. Assign print formatter to UIPrintPageRenderer
    let render = UIPrintPageRenderer()
    render.addPrintFormatter(fmt, startingAtPageAtIndex: 0)
  
    // 3. Assign paperRect and printableRect
    let page = CGRect(x: 0, y: 0, width: 595.2, height: 841.8) // A4, 72 dpi
    let printable = CGRectInset(page, 0, 0)
  
    render.setValue(NSValue(CGRect: page), forKey: "paperRect")
    render.setValue(NSValue(CGRect: printable), forKey: "printableRect")
  
    // 4. Create PDF context and draw
    let pdfData = NSMutableData()
    UIGraphicsBeginPDFContextToData(pdfData, CGRectZero, nil)
  
    for i in 1...render.numberOfPages() {
      UIGraphicsBeginPDFPage();
      let bounds = UIGraphicsGetPDFContextBounds()
      render.drawPageAtIndex(i - 1, inRect: bounds)
    }
    UIGraphicsEndPDFContext();
  
    // 5. Save PDF file
    pdfData.writeToFile(pathToPDF, atomically: true)
  }
}