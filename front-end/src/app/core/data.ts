


//this is what i can play around with
//only for switching from publishing to github pages to development
export function getImgUrl(str:string)
{
    let inDev = true;
    
    if(inDev == true)
        {
            if(str.startsWith('http'))
            {
                return str;
               /* if(localStorage.getItem('profile_pic') == null)
                {

                    //localStorage.getItem('profile_pic')
                    //console.log('image not in local storage');
                    return str;
                }
                else
                {
                    console.log('image in local storage');
                    let dataImage = localStorage.getItem('profile_pic')
                    return "data:image/png;base64," + dataImage;
                    //return str;
                }*/
                
            }
            else
            {
                return "../../../../assets/images/" + str;
            }
            
        }
            
    else
        {   
            if(str.startsWith('http'))
            {
                return str;
            }
            else
            {
                return "/tweeter/assets/images/" + str;
            } 
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
    //post?: Post; //this is always undefined for some reason
    
    text?: string;
    post?: Post;
    profile?: Profile;
    isSender: boolean;
    date: Date;


    constructor(t: string, p: Post,pr: Profile, is: boolean,d: Date ) {
        
        var po = undefined;
        var pro = undefined;
        if(p.id != 0)
        {
            console.log('**********is post in message constructor***************')
            //console.log('post: ' + p)
             po = p;
             pro = pr;
        }
       
        this.text = t;
        this.post = po;
        this.profile = pro;
        this.date = d;
        this.isSender = is;
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

                if(hours == 0)
                {
                    hours = 12;
                }
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
        return month + " " + this.date.getDate() + " " + this.date.getFullYear() + " " + hours+":"+minStr + " " + suffix;
      }

      toString(): string
      {
        if(this.text == "")
        {
            return " " + this.post + " " + this.isSender + " "+ this.date + " ";
        }
        else
        {
            return " " + this.text + " " + this.isSender + " "+ this.date+ " ";
        }
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
            if(this.messages[(this.messages.length-1)].text == '')
            {
                let message = this.messages[(this.messages.length-1)];
                let post = message.post;
                let sender = message.isSender ? 'You' : this.otherUser.username;
                return sender + ' sent @' + post?.acc_name + "'s post";
                //You/<other acc_name> sent @<acc_name of who made the post>'s post
                //etc. You sent @lebron_james23's post
            }
            else
            {
                return this.messages[(this.messages.length-1)].text;
            }

            
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

    let fakePost = new Post(0,'','','',new Date,'','',0,0,0,0);
    let fakeProfile = new Profile('','','','','',0,0);

    var convos = new Array<Convo>;
    
    let m1 = new Array<Message>;
    let p1 = new Profile(elon,elon,'bobby','roberto23','bio', 0,0);
    m1.push(new Message("hello, it's me",fakePost,fakeProfile, true, new Date));
    m1.push(new Message("howdy there",fakePost,fakeProfile, false, new Date));
    m1.push(new Message("would you like to go to the movies?",fakePost,fakeProfile, true, new Date));
    m1.push(new Message("I sure would, thank you",fakePost,fakeProfile, false, new Date));
    m1.push(new Message("hello, it's me",fakePost,fakeProfile, true, new Date));
    m1.push(new Message("howdy there",fakePost,fakeProfile, false, new Date));
    m1.push(new Message("would you like to go to the movies?",fakePost,fakeProfile, true, new Date));
    m1.push(new Message("I sure would, thank you",fakePost,fakeProfile, false, new Date));
    m1.push(new Message("hello, it's me",fakePost,fakeProfile, true, new Date));
    m1.push(new Message("howdy there",fakePost,fakeProfile, false, new Date));
    m1.push(new Message("would you like to go to the movies?",fakePost,fakeProfile, true, new Date));
    m1.push(new Message("I sure would, thank you",fakePost,fakeProfile, false, new Date));

    convos.push(new Convo(0,p1, m1, new Date()));

    let m2 = new Array<Message>;
    let p2 = new Profile(elon,elon,'gerry','theTEACHER3','bio', 0,0);
    m2.push(new Message("hey, u handed in you work late",fakePost,fakeProfile, false, new Date));
    m2.push(new Message("hya my dog ate it, so i had to print it again",fakePost,fakeProfile, true, new Date));
    m2.push(new Message("Don't lie to me, boy",fakePost,fakeProfile, false, new Date));
    m2.push(new Message("Ok sorry i just procrastinated.",fakePost,fakeProfile, true, new Date));

    convos.push(new Convo(0,p2, m2, new Date()));

    let m3 = new Array<Message>;
    let p3 = new Profile(elon,elon,'bart','therealbartsimpson','bio', 0,0);
    m3.push(new Message("hows it goin?",fakePost,fakeProfile, false, new Date));
    m3.push(new Message("It aint too bad, just skateboarding",fakePost,fakeProfile,true, new Date));
    m3.push(new Message("oh nice, i got a scooter",fakePost,fakeProfile, false, new Date));
    m3.push(new Message("skateboard > scooters 4life",fakePost,fakeProfile, true, new Date));

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
    topics.push(new SearchTopic('Art', 'test', 7903));
    return topics;
}
export function createSearchBarTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    let sports = ['archer','arena','arrow','athlete','axel','badminton','ball','base','bat','batter','bicycle','bike','bocce','bow','box','canoe','catch','cleats','club','coach','compete','crew','cricket','cycle','cyclist','dart','defense','diamond','dive','diver','exercise','fencing','field','fitness','frisbee','game','gear','goal','goalie','golf','golfer','guard','gym','gymnast','helmet','hockey','home','hoop','hoops','ice','infield','inning','javelin','jog','judo','jump','jumper','karate','kayak','kite','lacrosse','league','lose','loser','luge','major','mallet','mat','medal','mitt','move','net','offense','olympics','out','paddle','pitch','play','player','pole','polo','pool','puck','quarter','quiver','race','racer','referee','relay','ride','rink','row','rower','sail','score','scuba','skate','ski','skier','slalom','sled','sledder','snowboard','soccer','sport','squash','stadium','stick','surfer','swim','swimmer','tag','target','team','tee','tennis','throw','tie','triathlon','umpire','vault','volley','walk','weight','win','winner','winning','wrestler', 'Babe Ruth', ' Michael Jordan','Muhammad Ali',' Wayne Gretzky','Jesse Owens', 'Tiger Woods', 'Willie Mays', 'Jack Nicklaus','Gordie Howe','Jackie Robinson','Magic Johnson','Joe Montana','Bobby Orr','O.J. Simpson','Pete Rose','LeBron James', 'Steph Curry', 'Roberto Clemente', 'Cristiano Ronaldo','Lionel Messi','Roger Federer','Phil Mickelson','Kobe Bryant','Novak Djokovic','Usain Bolt','Maria Sharapova','Rory McIlroy']
    let food =['bagel','batter','beans','beer','biscuit','bread','broth','burger','burrito','butter','cake','candy','caramel','caviar','cheese','chili','chimichanga','chocolate','cider','cobbler','cocoa','coffee','cookie','cream','croissant','crumble','cuisine','curd','dessert','dish','drink','eggs','empanada','enchilada','entree','filet','fish','flour','foie gras','food','glaze','grill','hamburger','ice','juice','ketchup','kitchen','lard','liquor','margarine','marinade','mayo','mayonnaise','meat','milk','mousse','muffin','mushroom','noodle','nut','oil','olive','omelette','pan','pasta','paste','pastry','pie','pizza','plate','pot','poutine','pudding','queso','raclette','recipe','rice','salad','salsa','sandwich','sauce','seasoning','skillet','soda','sopapillas','soup','soy','spice','steak','stew','syrup','taco','taquito','tartar','taste','tea','toast','tostada','vinegar','waffle','water','wheat','wine','wok','yeast','yogurt','apple','apricot','avocado','banana','berry','cantaloupe','cherry','citron','citrus','coconut','date','fig','grape','guava','kiwi','lemon','lime','mango','melon','mulberry','nectarine','orange','papaya','peach','pear','pineapple','plum','prune','raisin','raspberry','tangerine']
    let music =['bassoon','bell','bongo','bugle','celesta','cello','clarinet','cymbal','flute','gong','guitar','harp','horn','marimba','oboe','piano','piccolo','sax','snare','string','tambourine','timpani','triangle','trombone','trumpet','tuba','vibes','viola','violin','xylophone','2Pac','50 Cent','A Thousand Horses','ABBA','ABC','Aerosmith','Agnetha Fältskog','Alan Jackson','Albert King','Alice Cooper','Alison Krauss','The All-American Rejects','The Allman Brothers Band','Amy Winehouse','Andre Rieu','Andrea Bocelli','Andrew W.K.','Anthrax','Antonio Carlos Jobim','Apache Indian','Arcade Fire','Ariana Grande','Arrested Development','Ashley Campbell','Astrud Gilberto','Aswad','Atlanta Rhythm Section','Audioslave','B.B. King','Badfinger','The Band','Barclay James Harvest','Barry White','The Beach Boys','Beastie Boys','The Beatles','Beck','Bee Gees','Belinda Carlisle','Ben Harper','Ben Howard','Benny Andersson','Big Country','Big Star','Bill Evans','Billie Eilish','Billie Holiday','Billy Currington','Billy Fury','Billy Preston','Björk','Black Eyed Peas','Black Sabbath','Black Uhuru','Blind Faith','Blink-182','Blondie','Blue Cheer','Bo Diddley','Bob Dylan','Bob Marley','Bob Seger','Bon Jovi','Bonnie Raitt','Booker T','Boyz II Men','Brantley Gilbert','Brenda Holloway','Brian Eno','The Brothers Johnson','Bruce Springsteen','Bryan Adams','Bryan Ferry','Buddy Guy','Buddy Holly','Burning Spear','Burt Bacharach','The Cadillac Three','Camel','Canned Heat','Captain Beefheart','Caravan','Carpenters','Carrie Underwood','Cat Stevens','Charlie Parker','Cheap Trick','The Chemical Brothers','Cher','Chris Cornell','Chris Stapleton','Chuck Berry','Cinderella','The Clash','Climax Blues Band','Coleman Hawkins','Commodores','Common','The Common Linnets','Corinne Bailey Rae','Count Basie','Counting Crows','Craig Armstrong','The Cranberries','Cream','Creedence Clearwater Revival','Crowded House','Culture Club','The Cure','Cutting Crew','D Angelo','DMX','The Damned','Daniel Hope','Danny Wilson & Gary Clark','David Bowie','Dean Martin','Debarge','Deep Purple','Def Leppard','Demi Lovato','Demis Roussos','Derek And The Dominos','Desmond Dekker','Diana Krall','Diana Ross','Diana Ross & The Supremes','Dierks Bentley','Dinah Washington','Dio','Dire Straits','Disclosure','Don Henley','Donna Summer','The Doors','Dr Dre','Drake','Duke Ellington','Dusty Springfield','EELS','EPMD','Eagles','Eagles Of Death Metal','Eazy-E','Eddie Cochran','Elbow','Ella Fitzgerald','Elliott Smith','Elton John','Elvis Costello','Elvis Presley','Emeli Sandé','Eminem','Enigma','Eric B. & Rakim','Eric Church','Eric Clapton','Etta James','Evanescence','Eve','Extreme','Fairport Convention','Fats Domino','Faust','Fergie','Fleetwood Mac','Florence + The Machine','The Flying Burrito Brothers','Foo Fighters','Four Tops','Foxy Brown','Frank Sinatra','Frank Zappa','Frankie Goes To Hollywood','Freddie Mercury','Free','Frida Lyngstad','The Game','Gang Starr','Gary Moore','Gene Krupa','Gene Vincent','Genesis','Gentle Giant','George Benson','George Harrison','George Michael','George Strait','George Thorogood','Georgie Fame','Ghostface Killah','Ginger Baker','Glass Animals','Glen Campbell','The Go-Go s','Gong','Grace Jones','Graham Parker','Grand Funk Railroad','Gregory Isaacs','Gregory Porter','Guns N Roses','Gwen Stefani','Halsey','Hank Williams','Heart','Heaven 17','Helmet','Herbie Hancock','Hoobastank','Howlin Wolf','Hoyt Axton','Huey Lewis & The News','The Human League','Humble Pie','INXS','Ice Cube','Iggy Pop','Imagine Dragons','Iron Maiden','Isaac Hayes','The Isley Brothers','It Bites','J.J. Cale','Jack Bruce','Jack Johnson','Jackson 5','Jacques Brel','Jadakiss','The Jam','James','James Bay','James Blake','James Brown','James Morrison','James Taylor','Jane s Addiction','Janet Jackson','Japan & David Sylvian','Jay-Z','Jeezy','Jeru the Damaja','Jessie J','Jimi Hendrix','Jimmy Buffett','Jimmy Cliff','Jimmy Eat World','Jimmy Ruffin','Jimmy Smith','Joan Armatrading','Joan Baez','Joe Cocker','Joe Jackson','Joe Sample','Joe Walsh / The James Gang','John Coltrane','John Fogerty','John Lee Hooker','John Lennon','John Martyn','John Mayall','John Mellencamp','John Williams','Johnny Cash','Johnny Gill','Joni Mitchell','Jonny Lang','Joss Stone','Jr. Walker & The All Stars','Julie London','Jurassic 5','Justin Bieber','Kacey Musgraves','Kaiser Chiefs','Kate Bush','Katy Perry','Keane','Keith Jarrett','Keith Richards','Keith Urban','Kendrick Lamar','Kenny Burrell','Kevin Coyne','The Killers','Killing Joke','Kim Carnes','The Kinks','Kip Moore','Kiss','The Kooks','Kool And The Gang','LL Cool J','Lady A','Lady GaGa','Lana Del Rey','Laura Marling','Led Zeppelin','Lee Scratch Perry','Lenny Kravitz','Leon Russell','Lester Young','Level 42','The Libertines','Lightnin Hopkins','Lil Wayne','Linton Kwesi Johnson','Lionel Richie','Little Big Town','Little Richard','Little Steven','Lloyd Cole','Lorde','Louis Armstrong','Lucinda Williams','Ludacris','Ludovico Einaudi','Luke Bryan','Lulu','The Lumineers','Lynyrd Skynyrd','Maddie & Tae','Madonna','Magazine','The Mamas & The Papas','Marc Almond','Marilyn Manson','Mark Knopfler','Maroon 5','Martha Reeves & The Vandellas','The Marvelettes','Marvin Gaye','Mary Hopkin','Mary J. Blige','Mary Wells','Massive Attack','Master P','The Mavericks','Maxi Priest','McCoy Tyner','Meat Loaf','Megadeth','Melody Gardot','Metallica','Method Man','Michael Jackson','Michael Kiwanuka','Michael Nyman','Mike & the Mechanics','Mike Oldfield','Miles Davis','Minnie Riperton','The Moody Blues','Morrissey','Motörhead','Muddy Waters','Mumford & Sons','Mötley Crüe','N.W.A','Nanci Griffith','Nas','Nat King Cole','Nazareth','Ne-Yo','Neil Diamond','Neil Young','Nelly','Neneh Cherry','New Edition','New York Dolls','Nick Drake','Nicki Minaj','Nik Kershaw','Nina Simone','Nine Inch Nails','Nirvana','The Nitty Gritty Dirt Band','No Doubt','Norah Jones','OMD','Ocean Colour Scene','OneRepublic','Onyx','Oscar Peterson','Otis Redding','The Ozark Mountain Daredevils','PJ Harvey','Papa Roach','Pat Benatar','Pato Banton','Patsy Cline','Patty Griffin','Paul McCartney and Wings','Paul Simon','Paul Weller','Peaches & Herb','Pearl Jam','Peggy Lee','Pete Townshend','Peter Frampton','Phil Collins','Phil Manzanera','PiL (Public Image Ltd)','Pink Floyd','Placebo','Poco','Poison','The Police','Portishead','Prince','Public Enemy','Pulp','Queen','Queens Of The Stone Age','Quicksilver Messenger Service','Quincy Jones','R.E.M.','Rainbow','Rammstein','Ray Charles','Reba McEntire','Red Hot Chili Peppers','Redman','Richie Havens','Rick James','Rick Nelson','Rick Ross','Rick Wakeman','The Righteous Brothers','Rihanna','Ringo Starr','Rise Against','Rob Zombie','Robbie Williams','Robert Cray','Robert Glasper','Robert Palmer','Robert Plant','Rod Stewart','Roger Daltrey','The Rolling Stones','Ronnie Lane','Ronnie Wood','Rory Gallagher','The Roots','Rosanne Cash','Roxy Music','Roy Orbison','Ruff Ryders','Rufus Wainwright','Rush','The Ruts','Saint Etienne','Salt-n-Pepa','Sam Cooke','Sam Hunt','Sam Smith','Sammy Hagar','Sandy Denny','Schiller','Scorpions','Scott Walker','Secret Garden','Selena Gomez','Sensational Alex Harvey Band','Serge Gainsbourg','Sergio Mendes','Sex Pistols','Shaggy','Sham 69','Shania Twain','Sheryl Crow','Simple Minds','Siouxsie & The Banshees','Slayer','Slick Rick','Sly & Robbie','Small Faces','The Smashing Pumpkins','Smokey Robinson','Smokey Robinson & The Miracles','Snoop Dogg','Snow Patrol','Soft Cell','Sonic Youth','Sonny Boy Williamson','Soul II Soul','Soundgarden','Spandau Ballet','Sparks','Spice Girls','Stan Getz','The Statler Brothers','Status Quo','Steel Pulse','Steely Dan','Steppenwolf','Stereo MCs','Stereophonics','Steve Earle','Steve Hackett','Steve Hillage','Steve Miller Band','Steve Winwood','Steven Tyler','Stevie Wonder','Sting','The Style Council','Styx','Sublime','Sum 41','Supertramp','Suzanne Vega','T-Bone Walker','T. Rex','Take That','Tammi Terrell','Tangerine Dream','Taylor Swift','Tears For Fears','Teena Marie','Temple Of The Dog','The Temptations','Tesla','Texas','Thelma Houston','Thelonious Monk','Thin Lizzy','Thomas Rhett','Three Dog Night','Tim McGraw','Toby Keith','Tom Jones','Tom Petty','Tom Waits','Toots & The Maytals','Tori Amos','Traffic','The Tragically Hip','Traveling Wilburys','The Tubes','U2','UB40','Ultravox','Underworld','Van der Graaf Generator','Vangelis','The Velvet Underground','The Verve','Vince Gill','The Walker Brothers','The Weeknd','Weezer','Wes Montgomery','Wet Wet Wet','will.i.am','Whitesnake','The Who','William Orbit','Willie Nelson','Wilson Pickett','Wishbone Ash','Wolfmother']
    let art = ['Picasso','Giotto','Leonardo','Cézanne','Rembrandt','Velázquez','Kandinsky','Monet','The Mona Lisa','Starry Night ','The Scream ','Guernica ','The Persistence of Memory ','Three Musicians']
    let entertainment = ['Gal Gadot','Steve Carell','Will Ferrell','Leonardo DiCaprio','Brad Pitt','Morgan Freeman', 'Will Smith', 'Kevin James', 'Chris Rock','Kevin Hart','George Clooney','Tom Cruise','Denzel Washington','Tom Hanks','Sandra Bullock','Jim Carrey','Christian Bale','Marilyn Monroe','Audrey Hepburn','Margot Robbie','Scarlett Johansson','Mila Kunis','Jennifer Lawrence','Natalie Portman','Megan Fox','Jessica Alba','Emma Watson','Jennifer Aniston']          
    let politics = ['Justin Trudeau','Trudeau','Trump','Kamala Harris','Putin','Vladimir Putin','United Nations','Canada','USA','Mexico', 'Europe', 'Russia','India','Spain','France','Italy','Donald Trump', 'Joe Biden', 'Nelson Mandela','Abraham Lincoln','climate change','immigration','democracy','communism','republicans','democrats','liberals','conservatives','NDP','free speech','taxes','federal','provincial','state','government','municipal']
    sports.forEach(element => {
        topics.push(new SearchTopic('Sports', element, 0));
    });
    food.forEach(element => {
        topics.push(new SearchTopic('Food', element, 0));
    });
    music.forEach(element => {
        topics.push(new SearchTopic('Music', element, 0));
    });
    art.forEach(element => {
        topics.push(new SearchTopic('Art', element, 0));
    });
    entertainment.forEach(element => {
        topics.push(new SearchTopic('Entertainment', element, 0));
    });
    politics.forEach(element => {
        topics.push(new SearchTopic('Politics', element, 0));
    });

    /*
    sports.forEach(element => {
        topics.push(new SearchTopic('Sports', element, 0));
    });
    */
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
