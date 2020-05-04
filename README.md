# CAP Aircraft Log Enhancement
Tampermonkey script to enhance CAP Aircraft Logs in WMIRS 2.0.  

This script is designed to run in TamperMonkey and will add addtional data collection options and error 
reporting on the Aircraft Log report under Support -> Reports -> Aircraft Log. 

## What does it do

### Error Checking
* Highlighted context of out incorrect Tach/Hobbs Times
    * If the End Time is not the next Sortie's start time it is highlighted red on both sorties. 
* Subtraction Test
    * Currently the Total time on the page is a summation of all of the data in the table, if there 
    are errors in the page subtracting the First Sortie Start Time from the Last Sortie End Time does not
    equal the time they have show at the bottom of the table.   We add an additional summary row, showing the 
    subtraction time.   If their total does not match our total it is highlighted red. 

### Data Collection 
* Enables exporting of aircraft log data to CSV file
* Enables gathering all logs for all aircraft in your wing, and exporting to csv. 
* Enables an Start/End Date model
    * To gather all of logs about a specific aircraft and display/export it.
    * To gather all of the aircraft for a wing and display/export it. 

## How to install

{{<a href="https://example.com/your_script.user.js">Click to install script X</a>
<small>(A userscript engine, like Tampermonkey, is required.)</small>}}