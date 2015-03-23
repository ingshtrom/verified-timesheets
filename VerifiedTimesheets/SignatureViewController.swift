//
//  SignatureViewController.swift
//  VerifiedTimesheets
//
//  Created by Alex Hokanson on 3/23/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation
import UIKit

class SignatureViewController : UIViewController {
  @IBOutlet weak var signView: PPSSignatureView!
  
  override func viewDidLoad() {
//    canvasView = PPSSignatureView(frame: CGRect(x: 22, y: 20, width: 497, height: 436))
  }
  
  override init() {
    super.init()
  }
  
  required init(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }
  
  func saveToImage() -> UIImage{
    
    return signView.signatureImage
  }
}