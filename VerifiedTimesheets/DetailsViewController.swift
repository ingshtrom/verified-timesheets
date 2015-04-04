//
//  DetailsViewController.swift
//  VerifiedTimesheets
//
//  Created by Alex.Hokanson on 1/3/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import UIKit;
import CoreData;

class DetailsViewController : UIViewController, UITextFieldDelegate {
  
  var popDatePickerForStart : PopDatePicker?
  var popDatePickerForEnd : PopDatePicker?
  var data : DataManager? = DataManager.sharedInstance
  var passedInTimeEntry : TimeEntry?
  var signatureImageData: NSData?
  
  @IBOutlet weak var startTimeTextField: UITextField!
  @IBOutlet weak var endTimeTextField: UITextField!
  @IBOutlet weak var totalTimeTextField: UITextField!
  @IBOutlet weak var notesTextView: UITextView!
  @IBOutlet weak var addSignatureButton: UIButton!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    let formatter = NSDateFormatter()
    formatter.dateStyle = .ShortStyle
    formatter.timeStyle = .ShortStyle
    
    if (passedInTimeEntry != nil) {
      if let startTime = passedInTimeEntry!.start_time as NSDate? {
        startTimeTextField.text = getFormatter().stringFromDate(startTime)
      }
      if let endTime = passedInTimeEntry!.end_time as NSDate? {
        endTimeTextField.text = getFormatter().stringFromDate(endTime)
      }
      if let notes = passedInTimeEntry!.notes as String? {
        notesTextView.text = notes
      }
      if let signature = passedInTimeEntry!.signature as NSData? {
        signatureImageData = signature
      }
      updateTotalTime()
    } else {
      let initDate = formatter.stringFromDate(NSDate())
      startTimeTextField.text = initDate
      endTimeTextField.text = initDate
    }
    
    popDatePickerForStart = PopDatePicker(forTextField: startTimeTextField)
    startTimeTextField.delegate = self
    popDatePickerForEnd = PopDatePicker(forTextField: endTimeTextField)
    endTimeTextField.delegate = self
  }
  
  func resign() {
    startTimeTextField.resignFirstResponder()
    endTimeTextField.resignFirstResponder()
  }
  
  func textFieldShouldBeginEditing(textField: UITextField) -> Bool {
    let isStartField = textField === startTimeTextField
    let isEndField = textField === endTimeTextField
    
    if (isStartField || isEndField) {
      var popDatePicker : PopDatePicker?
      if (isStartField) {
        popDatePicker = popDatePickerForStart
      } else {
        popDatePicker = popDatePickerForEnd
      }
      resign()
      let formatter = getFormatter()
      let initDate = formatter.dateFromString(textField.text)
      
      popDatePicker!.pick(self, initDate:initDate, dataChanged: { (newDate : NSDate, forTextField : UITextField) -> () in
        
        // here we don't use self (no retain cycle)
        forTextField.text = formatter.stringFromDate(newDate)
        self.updateTotalTime()
      })
      return false
    }
    else {
      return true
    }
  }
  
  // updates the total time field based on the time in the start and end text fields
  //
  // grabbed this rounding stuff from here:
  // http://stackoverflow.com/questions/27338573/rounding-a-double-value-to-x-number-of-decimal-places-in-swift
  func updateTotalTime() {
    let formatter: NSDateFormatter = getFormatter()
    let startTime: NSDate? = formatter.dateFromString(startTimeTextField.text)
    let endTime: NSDate? = formatter.dateFromString(endTimeTextField.text)
    let totalTime: Double = getTotalTime(startTime!, endTime!)
    totalTimeTextField.text = "\(totalTime) hours"
  }
  
  // get a formatter that we will use to convert from 
  // string -> date  and date -> string
  func getFormatter() -> NSDateFormatter {
    let formatter = NSDateFormatter()
    formatter.dateStyle = .ShortStyle
    formatter.timeStyle = .ShortStyle
    return formatter
  }
  
  @IBAction func cancelSignature(segue: UIStoryboardSegue) {

  }
  
  @IBAction func saveSignature(segue: UIStoryboardSegue) {
    if (segue.identifier! == "saveSignature") {
      let signatureViewCtrl : AddSignatureViewController? = segue.sourceViewController as? AddSignatureViewController
      if passedInTimeEntry != nil {
        self.passedInTimeEntry!.signature = signatureViewCtrl!.getBinaryImage()
      }
      self.signatureImageData = signatureViewCtrl!.getBinaryImage()
    }
  }
  
  override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
    if (
      segue.identifier != nil &&
      segue.identifier == "viewManagerInitialsSegue"
    ) {
      println("prepareForSegue -> viewManagerInitialsSegue")
      let destinationVC = (segue.destinationViewController as UINavigationController).viewControllers[0] as ViewSignatureViewController
      if passedInTimeEntry != nil {
        destinationVC.inboundImageData = passedInTimeEntry!.signature
      } else if (signatureImageData != nil) {
        destinationVC.inboundImageData = signatureImageData
      } else {
        destinationVC.inboundImageData = NSData()
      }
      println(passedInTimeEntry!.signature)
    }
  }
}
