//
//  SignatureViewController.swift
//  VerifiedTimesheets
//
//  Created by Alex.Hokanson on 3/31/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation

class AddSignatureViewController: UIViewController {
    
  @IBOutlet weak var clearBtn: UIButton!
  @IBOutlet weak var signView: PPSSignatureView!
  var inboundSignView : NSData?
  
  override func viewDidLoad() {
    super.viewDidLoad()
    if inboundSignView != nil {
      println("got an inboundSignView. Setting the image!")
      self.signView.signatureImage = UIImage(data: inboundSignView!)
      self.signView.hasSignature = true
    }
  }
  
  @IBAction func clearSignatureView() {
    self.signView.erase();
  }
  
  func getBinaryImage() -> NSData {
    var tmp: NSData? = UIImageJPEGRepresentation(signView.signatureImage, 0.5)
    if tmp == nil {
      tmp = NSData()
    }
    return tmp!
  }
}