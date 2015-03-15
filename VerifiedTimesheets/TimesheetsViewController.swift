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
    
    let entry: NSManagedObject? = data!.getItem(indexPath.item)
    let createdOn: String = getFormatter().stringFromDate(entry?.valueForKey("created_on") as NSDate)
    let startTime: NSDate = entry?.valueForKey("start_time") as NSDate
    let endTime: NSDate = entry?.valueForKey("end_time") as NSDate
    let totalTime: Double = getTotalTime(startTime, endTime)
    
    var cell: UITableViewCell = self.tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell
    cell.accessoryType = UITableViewCellAccessoryType.DisclosureIndicator
    cell.textLabel?.text = "\(createdOn) : \(totalTime) hrs"
    return cell
  }
  
  func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    let count = data!.getCount()
    println("count: \(count)")
    return count
  }
  
  @IBAction func cancelToTimesheetsViewController(segue: UIStoryboardSegue) {
    
  }
  
  @IBAction func saveNewTimesheet(segue: UIStoryboardSegue) {
    println("saveNewTimesheet")
    if (segue.identifier == "saveNewTimesheet") {
      let newRecordCtrl : NewRecordViewController? = segue.sourceViewController as? NewRecordViewController
      let formatter: NSDateFormatter = getFormatter()
      let startTime: NSDate? = formatter.dateFromString(newRecordCtrl!.startTimeTextField.text)
      let endTime: NSDate? = formatter.dateFromString(newRecordCtrl!.endTimeTextField.text)
      let notes: String = newRecordCtrl!.notesTextView.text
      data!.addItem(startTime!, endTimeDate: endTime!, notes: notes)
      self.tableView.reloadData()
    }
  }
  
  // get a formatter that we will use to convert from
  // string -> date  and date -> string
  func getFormatter() -> NSDateFormatter {
    let formatter = NSDateFormatter()
    formatter.dateStyle = .ShortStyle
    formatter.timeStyle = .ShortStyle
    return formatter
  }
}

