



//only for switching from publishing to github pages to development
export function getImgUrl(str:string)
{
    let inDev = true;
    
    if(inDev == true)
        {
            return "../../../../assets/images/" + str;
        }
            
    else
        {    
            return "/tweeter/assets/images/" + str; 
        }
}

//Global variables (for test data)
export var elon: string = getImgUrl('elon.jpeg');

export class Post {
    id: number; //needed for accessing db tweets(posts)
    profile: string; //url
    username: string;
    acc_name: string; 
    //e_time: string; 
    e_time: Date;
    text: string;
    image: string; //url
    comments: string;
    retweets: string;
    likes: string;
    views: string;

    constructor(id: number, p: string,u: string,a: string,e: Date,t: string,i: string,c: number,r: number,l: number,v: number) {
        this.id = id;
        this.profile = p;
        this.username = u;
        this.acc_name = a;
        this.e_time = e;
        this.text = t;
        this.image = i;
        this.comments = shortenNum(c);
        this.retweets = shortenNum(r);
        this.likes = shortenNum(l);
        this.views = shortenNum(v);
      }
    
      toString(): string
      {
        return " " + this.id + " " + this.profile + " "+ this.username + " " + this.acc_name + " " +this.e_time + " " +this.text + " " +this.image + " " + this.comments + " " +this.retweets + " "+this.likes + " "+this.views + " ";
    }
}

export class MessageCard{
    profile: string; //url
    username: string;
    acc_name: string; 
    date: string;//cuz its a number and measurement of time (min, hr, day)
    text: string;

    constructor(p: string,u: string,a: string,d: string,t: string) {
        this.profile = p;
        this.username = u;
        this.acc_name = a;
        this.date = d;
        this.text = t;
      }
}

export class Notification{
    type: string; //url
    profile: string;
    username: string;    
    text: string;

    constructor(type: string,p: string,u: string,text: string,) {
        this.type = type;
        this.profile = p;
        this.username = u;
        this.text = text;
      }
}
export class Notification2{
    type: string; //url
    profile_from: Profile;    
    tweet: Post; // not coming from db
    //maybe add post_id (needed to delete) but can only delete from post that already has id

    constructor(type: string, pf: Profile, tweet: Post) {
        this.type = type;
        this.profile_from = pf;
        this.tweet = tweet;
      }
}

export class SearchTopic {
    category: string;
    topic: string;
    postNum: string;

    constructor(c: string, t: string, p: number) {
        this.category = c;
        this.topic = t;
        this.postNum = shortenNum(p);
      }
}

function shortenNum(num: number): string {

    if (num < 1000){
        return num.toString();
    }
    else if (num < 1000000){
        if ((+(Math.round(num * 100) / 100000).toFixed(1)) % 1 == 0)
            {
                return (Math.round(num * 100) / 100000).toFixed(0) + "K";
            }
        else
            {
                return (Math.round(num * 100) / 100000).toFixed(1) + "K";
            }
        
    }
    else
        if ((+(Math.round(num * 100) / 100000).toFixed(1)) % 1 == 0)
            {
                return (Math.round(num * 100) / 100000000).toFixed(0) + "M";
            }
        else
            {
                return (Math.round(num * 100) / 100000000).toFixed(1) + "M";
            }
        
}


export class Profile {
    pic: string; //url
    header_pic: string; //ur;
    username: string;
    acc_name: string;
    bio: string;
    follow_count: string;
    follower_count: string;

    constructor(p: string, hp:string, u: string, a: string, b: string, fc: number, frc: number) {
        this.pic = p;
        this.header_pic = hp;
        this.username = u;
        this.acc_name = a;
        this.bio = b;
        this.follow_count = shortenNum(fc); 
        this.follower_count = shortenNum(frc); 
      }

      toString(): string
      {
        
        return " " + this.pic + " "+ this.username + " " + this.acc_name + " " +this.bio + " " +this.follow_count + " " +this.follower_count + " ";
      
    }

}

export class Message {
    text: string;
    isSender: boolean
    date: Date;
    
   
    constructor(t: string, is: boolean,d: Date ) {
        this.date = d;
        this.isSender = is;
        this.text = t;
      }

      getDateTime()
      {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let month = monthNames[(this.date.getMonth())];
        var hours = this.date.getHours();
        var suffix;
        if (hours <= 11)
            {
                
                suffix = "AM";
            }
        else if(hours = 12)
            {
                suffix = "PM";
            }
        else
            {
                hours = hours - 12;
                suffix = "PM";
            }
        var mins = this.date.getMinutes();
        var minStr;

        if (mins < 10)
            {
                minStr = "0"+ mins;
            }
        else
            {
                minStr = mins;
            }
        return month + " " + this.date.getDate() + " " + this.date.getFullYear() + " " + this.date.getHours()+":"+minStr + " " + suffix;
      }

      toString(): string
      {
        return " " + this.text + " " + this.isSender + " "+ this.date+ " ";
    }

}

export class Convo {
    id: number;
    startDate: Date;
    otherUser: Profile; //maybe change to type Profile
    messages: Message [];
   
    constructor(id: number, u: Profile, m: Message [], d: Date) {
        this.id = id;
        this.otherUser = u;
        this.messages = m;
        this.startDate =d;
      }

    getLastMessage()
    {
        if(this.messages.length > 0)
        {
            console.log('has a message');
            return this.messages[(this.messages.length-1)].text;
        }
        else
        {
            return '';
        }
    }

    getLastMessageDate()
    {
        let today = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var date;//: Date;
        var month;
        if(this.messages.length > 0)
        {   
            //console.log('has a date');
            date = new Date(this.messages[(this.messages.length-1)].date);
            console.log('has a date: ' + date);
            console.log('has a client side: ' + today);
            month = monthNames[(date.getMonth())];

           // console.log('has a date(condition): ');// + today.getFullYear() + " " + date.getFullYear());
            if(today.getFullYear() == date.getFullYear())
                {
                    console.log('has a date: ' + month + " " + date.getDate());
                    return month + " " + date.getDate();
                }
            else
                {   console.log('has a date: ' + month + " " + date.getDate() + " " + date.getFullYear());
                    return month + " " + date.getDate() + " " + date.getFullYear();
                }
            
        }
        else
        {
            date = this.startDate;
            month = monthNames[(date.getMonth())];

            if(today.getFullYear() == date.getFullYear())
                {
                    return month + " " + date.getDate();
                }
                else
                {
                    return month + " " + date.getDate() + " " + date.getFullYear();
                }
        }
        //let month = monthNames[(date.getMonth())];

        
       
    }

}

//function that creates data for the for you feed (homePage)
export function createConversations(){

    
    var convos = new Array<Convo>;
    
    let m1 = new Array<Message>;
    let p1 = new Profile(elon,elon,'bobby','roberto23','bio', 0,0);
    m1.push(new Message("hello, it's me", true, new Date));
    m1.push(new Message("howdy there", false, new Date));
    m1.push(new Message("would you like to go to the movies?", true, new Date));
    m1.push(new Message("I sure would, thank you", false, new Date));
    m1.push(new Message("hello, it's me", true, new Date));
    m1.push(new Message("howdy there", false, new Date));
    m1.push(new Message("would you like to go to the movies?", true, new Date));
    m1.push(new Message("I sure would, thank you", false, new Date));
    m1.push(new Message("hello, it's me", true, new Date));
    m1.push(new Message("howdy there", false, new Date));
    m1.push(new Message("would you like to go to the movies?", true, new Date));
    m1.push(new Message("I sure would, thank you", false, new Date));

    convos.push(new Convo(0,p1, m1, new Date()));

    let m2 = new Array<Message>;
    let p2 = new Profile(elon,elon,'gerry','theTEACHER3','bio', 0,0);
    m2.push(new Message("hey, u handed in you work late", false, new Date));
    m2.push(new Message("hya my dog ate it, so i had to print it again", true, new Date));
    m2.push(new Message("Don't lie to me, boy", false, new Date));
    m2.push(new Message("Ok sorry i just procrastinated.", true, new Date));

    convos.push(new Convo(0,p2, m2, new Date()));

    let m3 = new Array<Message>;
    let p3 = new Profile(elon,elon,'bart','therealbartsimpson','bio', 0,0);
    m3.push(new Message("hows it goin?", false, new Date));
    m3.push(new Message("It aint too bad, just skateboarding", true, new Date));
    m3.push(new Message("oh nice, i got a scooter", false, new Date));
    m3.push(new Message("skateboard > scooters 4life", true, new Date));

    convos.push(new Convo(0,p3, m3, new Date()));

    return convos;

}

//function that creates data for the for you feed (homePage)
 export function createForYouFeed(){
    //creating list
    var feed = new Array<Post>;
 /*
    //appending instances to list
    feed.push(new Post(elon, 'shane', 'shane17', '4h', 'Yo, this is the for you feed', elon, 3, 7, 35, 201));
    feed.push(new Post(elon, 'barry', 'sanders22', '20m', "I'm the best to ever do it", '', 15, 50, 120, 1034));
    feed.push(new Post(elon, 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", '', 120, 1000, 12000, 300000));
    feed.push(new Post(elon, 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', elon, 1, 2, 7, 51));
    feed.push(new Post(elon, 'shane', 'shane17', '4h', 'Yo, this is the for you feed', elon, 3, 7, 35, 201));
    feed.push(new Post(elon, 'barry', 'sanders22', '20m', "I'm the best to ever do it", '', 15, 50, 120, 1034));
    feed.push(new Post(elon, 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", '', 120, 1000, 12000, 300000));
    feed.push(new Post(elon, 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', '', 1, 2, 7, 51));
*/
    return feed;
 }

 export function createFollowingFeed(){
    //creating list
    var feed = new Array<Post>;
 /*
    //appending instances to list
    feed.push(new Post(elon, 'shane', 'shane17', '4h', 'Yo, this is the following feed', elon, 3, 7, 35, 201));
    feed.push(new Post(elon, 'barry', 'sanders22', '20m', "I'm the best to ever do it", '', 15, 50, 120, 1034));
    feed.push(new Post(elon, 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", '', 120, 1000, 12000, 300000));
    feed.push(new Post(elon, 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', elon, 1, 2, 7, 51));
    feed.push(new Post(elon, 'shane', 'shane17', '4h', 'Yo, this is the for you feed', elon, 3, 7, 35, 201));
    feed.push(new Post(elon, 'barry', 'sanders22', '20m', "I'm the best to ever do it", '', 15, 50, 120, 1034));
    feed.push(new Post(elon, 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", '', 120, 1000, 12000, 300000));
    feed.push(new Post(elon, 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', '', 1, 2, 7, 51));
*/
    return feed;
 }

//function that creates data for the MessagesPage 
export function createMessages(){
    //creating list
    var messages = new Array<MessageCard>;
 
    //appending instances to list
    messages.push(new MessageCard(elon, 'shane', 'shane17', 'Feb 21, 2023', 'Yo, long time no see'));
    messages.push(new MessageCard(elon, 'hanna nurkic', 'hannaBanana4', 'Apr 2, 2022', 'Its finally springtime'));
    messages.push(new MessageCard(elon, 'george', 'GLopez15', 'Apr 26, 2023', 'ba ba ba ba ba ba buh, ba da da buh buh, ba ba ba ba ba ba buh, ba da da buh buh'));
    messages.push(new MessageCard(elon, 'miguel', 'oharaM', 'Dec 25, 2021', 'Merry merry, to all!'));
    messages.push(new MessageCard(elon, 'bean', 'littlebean1', 'Mar 10, 2022', 'Mewo mewoi, meow'));
    messages.push(new MessageCard(elon, 'shane', 'shane17', 'Feb 21, 2023', 'Yo, long time no see'));
    messages.push(new MessageCard(elon, 'hanna nurkic', 'hannaBanana4', 'Apr 2, 2022', 'Its finally springtime'));
    messages.push(new MessageCard(elon, 'george', 'GLopez15', 'Apr 26, 2023', 'ba ba ba ba ba ba buh, ba da da buh buh, ba ba ba ba ba ba buh, ba da da buh buh'));
    messages.push(new MessageCard(elon, 'miguel', 'oharaM', 'Dec 25, 2021', 'Merry merry, to all!'));
    messages.push(new MessageCard(elon, 'bean', 'littlebean1', 'Mar 10, 2022', 'Mewo mewoi, meow'));

    return messages;
}

//function that creates data for the notification page
export function createAllNotifications(){
    // creating list
    var notifications = new Array<Notification>;
 
    //appending instances to list
    notifications.push(new Notification('Heart', elon, 'shane', 'all'));
    notifications.push(new Notification('News', elon, 'hanna', 'sentence setenc esnetence'));
    notifications.push(new Notification('Retweet', elon, 'george', 'paragraph paragraph paragraph paragraph'));
    notifications.push(new Notification('Heart', elon, 'barry', 'more words more words more words'));
    notifications.push(new Notification('News', elon, 'windsor police', 'we caught the guy'));
    notifications.push(new Notification('Heart', elon, 'shane', 'words words words'));
    notifications.push(new Notification('News', elon, 'hanna', 'sentence setenc esnetence'));
    notifications.push(new Notification('Retweet', elon, 'george', 'paragraph paragraph paragraph paragraph'));
    notifications.push(new Notification('Heart', elon, 'barry', 'more words more words more words'));
    notifications.push(new Notification('News', elon, 'windsor police', 'we caught the guy'));
    
    return notifications;
}

export function createVerifiedNotifications(){
    // creating list
    var notifications = new Array<Notification>;
 
    //appending instances to list
    notifications.push(new Notification('Heart', elon, 'shane', 'verified'));
    notifications.push(new Notification('News', elon, 'hanna', 'sentence setenc esnetence'));
    notifications.push(new Notification('Retweet', elon, 'george', 'paragraph paragraph paragraph paragraph'));
    notifications.push(new Notification('Heart', elon, 'barry', 'more words more words more words'));
    notifications.push(new Notification('News', elon, 'windsor police', 'we caught the guy'));
    notifications.push(new Notification('Heart', elon, 'shane', 'words words words'));
    notifications.push(new Notification('News', elon, 'hanna', 'sentence setenc esnetence'));
    notifications.push(new Notification('Retweet', elon, 'george', 'paragraph paragraph paragraph paragraph'));
    notifications.push(new Notification('Heart', elon, 'barry', 'more words more words more words'));
    notifications.push(new Notification('News', elon, 'windsor police', 'we caught the guy'));
    
    return notifications;
}



export function createMentionsNotifications(){
    // creating list
    var notifications = new Array<Notification>;
 
     //appending instances to list
     notifications.push(new Notification('Heart', elon, 'shane', 'mentions'));
     notifications.push(new Notification('News', elon, 'hanna', 'sentence setenc esnetence'));
     notifications.push(new Notification('Retweet', elon, 'george', 'paragraph paragraph paragraph paragraph'));
     notifications.push(new Notification('Heart', elon, 'barry', 'more words more words more words'));
     notifications.push(new Notification('News', elon, 'windsor police', 'we caught the guy'));
     notifications.push(new Notification('Heart', elon, 'shane', 'words words words'));
     notifications.push(new Notification('News', elon, 'hanna', 'sentence setenc esnetence'));
     notifications.push(new Notification('Retweet', elon, 'george', 'paragraph paragraph paragraph paragraph'));
     notifications.push(new Notification('Heart', elon, 'barry', 'more words more words more words'));
     notifications.push(new Notification('News', elon, 'windsor police', 'we caught the guy'));
     
    return notifications;
}


//function that creates data for the search page

export function createSecondarySearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Art', 'SECONDARY', 7903));
    topics.push( new SearchTopic('Music', 'Big Sean', 12005));
    topics.push( new SearchTopic('Music', 'Lil Wayne', 100));
    topics.push( new SearchTopic('Food', 'Macoroni', 60000));
    topics.push( new SearchTopic('Sports', 'McJesus', 120550));
    
    return topics;
}


export function createForYouSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Art', 'FORYOU', 7903));
    topics.push( new SearchTopic('Music', 'Big Sean', 12005));
    topics.push( new SearchTopic('Music', 'Lil Wayne', 100));
    topics.push( new SearchTopic('Food', 'Macoroni', 60000));
    topics.push( new SearchTopic('Sports', 'McJesus', 120550));
    topics.push(new SearchTopic('Art', 'Banksy', 7903));
    
    return topics;
}

export function createTrendingSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Art', 'TRENDING', 7903));
    topics.push( new SearchTopic('Music', 'Big Sean', 12005));
    topics.push( new SearchTopic('Music', 'Lil Wayne', 100));
    topics.push( new SearchTopic('Food', 'Macoroni', 60000));
    topics.push( new SearchTopic('Sports', 'McJesus', 120550));
    topics.push(new SearchTopic('Art', 'Banksy', 7903));
    
    return topics;
}

export function createNewsSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Art', 'NEWS', 7903));
    topics.push( new SearchTopic('Music', 'Big Sean', 12005));
    topics.push( new SearchTopic('Music', 'Lil Wayne', 100));
    topics.push( new SearchTopic('Food', 'Macoroni', 60000));
    topics.push( new SearchTopic('Sports', 'McJesus', 120550));
    topics.push(new SearchTopic('Art', 'Banksy', 7903));
    topics.push(new SearchTopic('Art', 'monkey', 7903));
    topics.push( new SearchTopic('Music', 'ceelo green', 12005));
    topics.push( new SearchTopic('Music', 'drake', 100));
    topics.push( new SearchTopic('Food', 'bacon', 60000));
    topics.push( new SearchTopic('Sports', 'Lions', 120550));
    topics.push( new SearchTopic('Sports', 'tevin', 120550));
    topics.push(new SearchTopic('Art', 'teller', 7903));
    topics.push(new SearchTopic('Art', 'davinci', 7903));
    return topics;
}

export function createSportsSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Art', 'SPORTS', 7903));
    topics.push( new SearchTopic('Music', 'Big Sean', 12005));
    topics.push( new SearchTopic('Music', 'Lil Wayne', 100));
    topics.push( new SearchTopic('Food', 'Macoroni', 60000));
    topics.push( new SearchTopic('Sports', 'McJesus', 120550));
    topics.push(new SearchTopic('Art', 'Banksy', 7903));
    
    return topics;
}

export function createEntertainmentSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Art', 'ENTERTAINMENT', 7903));
    topics.push( new SearchTopic('Music', 'Big Sean', 12005));
    topics.push( new SearchTopic('Music', 'Lil Wayne', 100));
    topics.push( new SearchTopic('Food', 'Macoroni', 60000));
    topics.push( new SearchTopic('Sports', 'McJesus', 120550));
    topics.push(new SearchTopic('Art', 'Banksy', 7903));
    
    return topics;
}

//function that creates data for profiles
export function createProfiles(){
    //creating list
    var profiles = new Array<Profile>;
 
    //appending instances to list
    profiles.push(new Profile(elon,elon, 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
    profiles.push(new Profile(elon,elon, 'Barry', 'cuddlyBar', 'always be the best bear you can be!', 2305, 5000));
    profiles.push(new Profile(elon,elon, 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', 150, 4500));
    //profiles.push(new Profile(elon, 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
   // profiles.push(new Profile(elon, 'Barry', 'cuddlyBar', 'always be the best bear you can be!', 2305, 5000));
   // profiles.push(new Profile(elon, 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', 150, 4500));
    
    return profiles;
}

export function createAllProfiles(){
    //creating list
    var profiles = new Array<Profile>;
 
    //appending instances to list
    profiles.push(new Profile(elon,elon, 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
    profiles.push(new Profile(elon,elon, 'barry', 'cuddlyBar', 'always be the best bear you can be!', 2305, 5000));
    profiles.push(new Profile(elon,elon, 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', 150, 4500));
    profiles.push(new Profile(elon,elon, 'shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
    profiles.push(new Profile(elon,elon, 'jon', 'jonbon', 'half way there!', 2305, 5000));
    profiles.push(new Profile(elon,elon, 'emmy', 'emmy345', 'Life is ruff!', 150, 4500));
    profiles.push(new Profile(elon,elon, 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
    profiles.push(new Profile(elon,elon, 'barry', 'cuddlyBar', 'always be the best bear you can be!', 2305, 5000));
    profiles.push(new Profile(elon,elon, 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', 150, 4500));
    profiles.push(new Profile(elon,elon, 'shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
    profiles.push(new Profile(elon,elon, 'jon', 'jonbon', 'half way there!', 2305, 5000));
    profiles.push(new Profile(elon,elon, 'emmy', 'emmy345', 'Life is ruff!', 150, 4500));
    profiles.push(new Profile(elon,elon, 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
    profiles.push(new Profile(elon,elon, 'barry', 'cuddlyBar', 'always be the best bear you can be!', 2305, 5000));
    profiles.push(new Profile(elon,elon, 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', 150, 4500));
    profiles.push(new Profile(elon,elon, 'shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
    profiles.push(new Profile(elon,elon, 'jon', 'jonbon', 'half way there!', 2305, 5000));
    profiles.push(new Profile(elon,elon, 'emmy', 'emmy345', 'Life is ruff!', 150, 4500));
    
    return profiles;
}

export function getProfile(username: string, profiles: Profile[]){
    
    for (var profile of profiles) {
       if(username == profile.username)
        {
            return profile;
        }
   }
    return new Profile('','','','','',0,0);
 }
