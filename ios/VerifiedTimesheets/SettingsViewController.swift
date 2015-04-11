//
//  SettingsViewController.swift
//  VerifiedTimesheets
//
//  Created by Alex Hokanson on 4/6/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation
import UIKit

class SettingsViewController : UIViewController {
  var emailTextField : UITextField!
  var saveButton : UIButton!
  
  override func viewDidLoad() {
    emailTextField.text = NSUserDefaults.standardUserDefaults().stringForKey("report_email_address")
  }
  
  @IBAction func saveSettings () {
    NSUserDefaults.standardUserDefaults().setValue(emailTextField.text, forKey: "report_email_address")
  }
  
  should
}