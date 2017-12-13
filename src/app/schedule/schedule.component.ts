import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

// Do not import from 'firebase' as you'd lose the tree shaking benefits
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';

interface Booking{
  ref:String
  Description:String;
  Available:boolean;
  Date:Date;
  Location:string;
  Type:string
}



@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})


export class ScheduleComponent implements OnInit {
  scheduleBooking:string;
  

  Description:string
  Available:boolean;
  Date:Date;
  Location:string;
  Type:string;
  Time:string;
  bookingCol:AngularFirestoreCollection<Booking>;
  booking: Observable<Booking[]>;
  bookingAvailable:Booking[];
  bookingOld:Booking[];
  user: Observable<firebase.User>;
  
  
  constructor(private afs:AngularFirestore, private auth:AngularFireAuth) { 
    this.user = auth.authState;
    
  }

  ngOnInit() {   

  this.bookingCol = this.afs.collection('Booking');
  this.booking = this.bookingCol.valueChanges();
 this.bookingAvailable = this.getAvailableDates();
 console.log(this.bookingAvailable)
// this.bookingOld = this.getOldDates();

  }

isBookingAvailable(Booking){
  if(Booking.Available){
    return "Available"
  } else {
    return "Not Available"
  }
}



  getAvailableDates(){
    var bookingAvailable:Booking[];     
    bookingAvailable = new Array();
    this.bookingCol.ref.where("Available", "==", true)
    .orderBy("Date").orderBy("Time")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var booking:Booking;
          booking = {
                      ref: doc.id,
                      Description: doc.data().Description,
                      Available: doc.data().Available,
                      Date: doc.data().Date,
                      Location: doc.data().Location,
                      Type: doc.data().Type,
          }
          bookingAvailable.push(booking);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    return bookingAvailable;
  }


  addBooking(){
    console.log("hello")
    this.afs.collection('Booking').add({
      'Description':this.Date.toString().slice(0,16) + " at " + this.Time + ": " + this.Location + " " + this.Type  ,
      'Available':true, 
      'Date':new Date(this.Date),
      'Location':this.Location,
      'Time': this.Time,
      'Type':this.Type})
  }

  deleteBooking(id){
    console.log(id)
    this.afs.doc('Booking/'+id).delete();
  }

  setScheduleEvent(book){
    console.log(book)
  }
  scheduleEvent(){
    console.log(this.scheduleBooking)
    this.afs.collection("Booking").doc(this.scheduleBooking).update({
      'Available':false,
    });
    


}
}
