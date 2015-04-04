//
//  SignatureViewController.swift
//  VerifiedTimesheets
//
//  Created by Alex.Hokanson on 4/3/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation

class ViewSignatureViewController: UIViewController {
  @IBOutlet weak var signView: UIImageView!
  var inboundImageData : NSData?
  
  override func viewDidLoad() {
    super.viewDidLoad()
    if inboundImageData != nil {
      println("got an inboundSignView. Setting the image!")
      self.signView.image = UIImage(data: inboundImageData!)
    }
  }
}