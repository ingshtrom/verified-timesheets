//
//  ViewController.swift
//  VerifiedTimesheets
//
//  Created by Alex.Hokanson on 1/3/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import UIKit
import CoreData

class TimesheetsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, UIPopoverPresentationControllerDelegate {
  
  @IBOutlet
  var tableView: UITableView!
  let data: DataManager? = DataManager.sharedInstance
  
  override func viewDidLoad() {
    super.viewDidLoad()
    self.title = "Timesheets"
    self.tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
  }

  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
  }

  func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
    let entry = extractRowToTimeEntry(indexPath)
    let createdOn = getFormatter().stringFromDate(entry.created_on)
    let totalTime = getTotalTime(entry.start_time, entry.end_time)
    
    var cell: UITableViewCell = self.tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell
    cell.selectionStyle = .Default
    cell.accessoryType = .DisclosureIndicator
    cell.textLabel?.text = "\(createdOn) : \(totalTime) hrs"
    return cell
  }
  
  func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return data!.getCount()
  }
  
  override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
//    println("prepareForSegue: \(segue.identifier)")
    if (
      segue.identifier != nil &&
      segue.identifier == "tableViewToDetailsView"
    ) {
      let selectedEntry: TimeEntry = extractRowToTimeEntry(tableView.indexPathForSelectedRow()!)
      let destinationVC = (segue.destinationViewController as UINavigationController).viewControllers[0] as DetailsViewController
      destinationVC.passedInTimeEntry = selectedEntry
    }
  }
  
  func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
    performSegueWithIdentifier("tableViewToDetailsView", sender: self)
  }
  
  // need in order to cancel from the details (NewRecordViewController) view
  @IBAction func cancelToTimesheetsViewController(segue: UIStoryboardSegue) {
    
  }
  
  @IBAction func saveNewTimesheet(segue: UIStoryboardSegue) {
    if (segue.identifier == "saveNewTimesheet") {
      let detailsViewCtrl : DetailsViewController? = segue.sourceViewController as? DetailsViewController
      
      let formatter: NSDateFormatter = getFormatter()
      let startTime: NSDate? = formatter.dateFromString(detailsViewCtrl!.startTimeTextField.text)
      let endTime: NSDate? = formatter.dateFromString(detailsViewCtrl!.endTimeTextField.text)
      let notes: String = detailsViewCtrl!.notesTextView.text
      var signature: NSData? = detailsViewCtrl!.signatureImageData
      
      println("signature: \(signature?)")
      if signature == nil {
        println("signature is nil")
        signature = NSData()
      }
      
      if (detailsViewCtrl?.passedInTimeEntry != nil) {
        detailsViewCtrl?.passedInTimeEntry?.entityRef.setValue(endTime!, forKey: "end_time")
        detailsViewCtrl?.passedInTimeEntry?.entityRef.setValue(startTime!, forKey: "start_time")
        detailsViewCtrl?.passedInTimeEntry?.entityRef.setValue(notes, forKey: "notes")
        detailsViewCtrl?.passedInTimeEntry?.entityRef.setValue(signature, forKey: "manager_initials")
        data!.updateContext()
      } else {
        data!.addItem(startTime!, endTimeDate: endTime!, notes: notes, signature: signature!)
      }
      self.tableView.reloadData()
    }
  }
  
  @IBAction func generatePDF() {
    let html: NSString = HTMLGenerator.fromCoreData()
  }
  
  func extractRowToTimeEntry(index: NSIndexPath) -> TimeEntry {
    let entry: NSManagedObject? = data!.getItem(index.item)
    var tmp: AnyObject? = entry?.valueForKey("manager_initials")
    var signature: NSData?
    
    if tmp != nil {
      signature = tmp as? NSData
    } else {
      signature = NSData()
    }
    
    
    return TimeEntry(
      createdOn: entry?.valueForKey("created_on") as NSDate,
      startTime: entry?.valueForKey("start_time") as NSDate,
      endTime: entry?.valueForKey("end_time") as NSDate,
      notes: entry?.valueForKey("notes") as String,
      signature:  signature!,
      entityRef: entry!
    )
  }
}

