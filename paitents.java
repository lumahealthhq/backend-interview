

/*
since overriding compareTo method:

if 1 then this > paitents b;
if 0 then they are the same value
if -1 then paitents b is greater than this

*/

public class Paitents implements Comparable{
  int id = ID;
  int age; // (in years) 10
  int latitude; //5
  int longitude; // 5
  int acceptedOffers; //30
  int canceledOffers; // 30
  int averageReplyTime; //in seconds - 20

public class Patients (int ID, int age, int latitude, int longitude, int acceptedOffers, int canceledOffers, int averageReplyTime){
    this.id = ID;
    this.age = age; // (in years) 10
    this.latitude = latitude; //5
    this.longitude = longitude; // 5
    this.acceptedOffers = acceptedOffers; //30
    this.canceledOffers = canceledOffers; // 30
    this.averageReplyTime = averageReplyTime; //in seconds - 20
  }




@Override
public int compareTo (Patients b) {
  int total = 0;
  if(this.age > b.age)
  {
    total+= 10;
  }
  else{
    total -= 10;
  }
  if(this.latitude > b.latitude)
  {
    total += 5;
  }
  else{
    total -= 5;
  }
  if(this.longitude > b.longitude)
  {
    total += 5;
  }
  else{
    total -= 5;
  }
  if(this.acceptedOffers > b.acceptedOffers)
  {
    total += 30;
  }
  else{
    total -= 30;
  }
  if(this.canceledOffers > b.canceledOffers)
  {
    total += 30;
  }
  else{
    total -= 30;
  }
  if(this.averageReplyTime > b.averageReplyTime)
  {
    total += 20;
  }
  else{
    total -= 20;
  }
  if(total > 0)
  {
    return 1;
  }
  else if (total == 0)
  {
    return 0;
  }
  else{
    return -1;
  }
 }


}
