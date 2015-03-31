//
//  SignatureViewController.swift
//  VerifiedTimesheets
//
//  Created by Alex.Hokanson on 3/31/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation

class SignatureViewController: UIViewController {
    
  @IBOutlet weak var clearBtn: UIButton!
  @IBOutlet weak var signView: PPSSignatureView!
  
  override func viewDidLoad() {
    super.viewDidLoad()
  }
  
  @IBAction func clearSignatureView() {
    self.signView.erase();
  }
  
  func getBinaryImage() -> NSData {
    return UIImageJPEGRepresentation(signView.signatureImage, 0.5)
  }
}