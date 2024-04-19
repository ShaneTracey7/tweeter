

//Global variables (for test data)
var elon: string = '../../../../assets/images/elon.jpeg';


export class Show{
    show: boolean;
    constructor(s: boolean) {
        this.show = s;
    }
}


export class Post {
    profile: string; //url
    username: string;
    acc_name: string; 
    e_time: string; // cuz its a number and measurement of time (min, hr, day)
    text: string;
    image: string; //url
    comments: number;
    retweets: number;
    likes: number;
    views: number;

    constructor(p: string,u: string,a: string,e: string,t: string,i: string,c: number,r: number,l: number,v: number) {
        this.profile = p;
        this.username = u;
        this.acc_name = a;
        this.e_time = e;
        this.text = t;
        this.image = i;
        this.comments = c;
        this.retweets = r;
        this.likes = l;
        this.views = v;
      }
}

export class Message{
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
    username: string;
    acc_name: string;
    bio: string;
    follow_count: string;
    follower_count: string;

    constructor(p: string, u: string, a: string, b: string, fc: number, frc: number) {
        this.pic = p;
        this.username = u;
        this.acc_name = a;
        this.bio = b;
        this.follow_count = shortenNum(fc); 
        this.follower_count = shortenNum(frc); 
      }

}

//function that creates data for the for you feed (homePage)
 export function createForYouFeed(){
    //creating list
    var feed = new Array<Post>;
 
    //appending instances to list
    feed.push(new Post(elon, 'shane', 'shane17', '4h', 'Yo, this is the for you feed', 'image_url', 3, 7, 35, 201));
    feed.push(new Post(elon, 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034));
    feed.push(new Post(elon, 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000));
    feed.push(new Post(elon, 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51));
    feed.push(new Post(elon, 'shane', 'shane17', '4h', 'Yo, this is the for you feed', 'image_url', 3, 7, 35, 201));
    feed.push(new Post(elon, 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034));
    feed.push(new Post(elon, 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000));
    feed.push(new Post(elon, 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51));

    return feed;
 }
 export function createFollowingFeed(){
    //creating list
    var feed = new Array<Post>;
 
    //appending instances to list
    feed.push(new Post(elon, 'shane', 'shane17', '4h', 'Yo, this is the following feed', 'image_url', 3, 7, 35, 201));
    feed.push(new Post(elon, 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034));
    feed.push(new Post(elon, 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000));
    feed.push(new Post(elon, 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51));
    feed.push(new Post(elon, 'shane', 'shane17', '4h', 'Yo, this is the for you feed', 'image_url', 3, 7, 35, 201));
    feed.push(new Post(elon, 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034));
    feed.push(new Post(elon, 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000));
    feed.push(new Post(elon, 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51));

    return feed;
 }


//function that creates data for the MessagesPage 
export function createMessages(){
    //creating list
    var messages = new Array<Message>;
 
    //appending instances to list
    messages.push(new Message(elon, 'shane', 'shane17', 'Feb 21, 2023', 'Yo, long time no see'));
    messages.push(new Message(elon, 'hanna nurkic', 'hannaBanana4', 'Apr 2, 2022', 'Its finally springtime'));
    messages.push(new Message(elon, 'george', 'GLopez15', 'Apr 26, 2023', 'ba ba ba ba ba ba buh, ba da da buh buh, ba ba ba ba ba ba buh, ba da da buh buh'));
    messages.push(new Message(elon, 'miguel', 'oharaM', 'Dec 25, 2021', 'Merry merry, to all!'));
    messages.push(new Message(elon, 'bean', 'littlebean1', 'Mar 10, 2022', 'Mewo mewoi, meow'));
    messages.push(new Message(elon, 'shane', 'shane17', 'Feb 21, 2023', 'Yo, long time no see'));
    messages.push(new Message(elon, 'hanna nurkic', 'hannaBanana4', 'Apr 2, 2022', 'Its finally springtime'));
    messages.push(new Message(elon, 'george', 'GLopez15', 'Apr 26, 2023', 'ba ba ba ba ba ba buh, ba da da buh buh, ba ba ba ba ba ba buh, ba da da buh buh'));
    messages.push(new Message(elon, 'miguel', 'oharaM', 'Dec 25, 2021', 'Merry merry, to all!'));
    messages.push(new Message(elon, 'bean', 'littlebean1', 'Mar 10, 2022', 'Mewo mewoi, meow'));

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
    profiles.push(new Profile(elon, 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
    profiles.push(new Profile(elon, 'Barry', 'cuddlyBar', 'always be the best bear you can be!', 2305, 5000));
    profiles.push(new Profile(elon, 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', 150, 4500));
    //profiles.push(new Profile(elon, 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', 200, 150));
   // profiles.push(new Profile(elon, 'Barry', 'cuddlyBar', 'always be the best bear you can be!', 2305, 5000));
   // profiles.push(new Profile(elon, 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', 150, 4500));
    
    return profiles;
}

