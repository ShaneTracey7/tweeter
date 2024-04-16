

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
/*
class Notification{
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
*/















/*

class SearchTopic:
    category: str 
    topic: str 
    postNum: int


class Profile:
    pic: str # url
    username: str 
    acc_name: str
    bio: str
    follow_count: str
    follower_count: str

def shortenNum(num):

    if num < 1000:
       return str(num)
    elif num < 1000000:
        return str(round(decimal.Decimal(num) / decimal.Decimal(1000),1)) + "K"
    else:
        return str(round(decimal.Decimal(num) / decimal.Decimal(1000000),1)) + "M"
    
    




*/

//function that creates data for the for you feed (homePage)
 export function createForYouFeed(){
    //creating list
    var feed = new Array<Post>;
 
    //appending instances to list
    feed.push(new Post('url', 'shane', 'shane17', '4h', 'Yo, this is the for you feed', 'image_url', 3, 7, 35, 201));
    feed.push(new Post('url', 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034));
    feed.push(new Post('url', 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000));
    feed.push(new Post('url', 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51));
    feed.push(new Post('url', 'shane', 'shane17', '4h', 'Yo, this is the for you feed', 'image_url', 3, 7, 35, 201));
    feed.push(new Post('url', 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034));
    feed.push(new Post('url', 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000));
    feed.push(new Post('url', 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51));

    return feed;
 }
 /*
//function that creates data for the following feed (homePage)
def createFollowingFeed():
    # creating list
    feed = []
 
    # appending instances to list
    feed.append(Post('url', 'shane', 'shane17', '4h', 'Yo, this is the following feed', 'image_url', 3, 7, 35, 201))
    feed.append(Post('url', 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034))
    feed.append(Post('url', 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000))
    feed.append(Post('url', 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51))
    feed.append(Post('url', 'shane', 'shane17', '4h', 'Yo, this is the following feed', 'image_url', 3, 7, 35, 201))
    feed.append(Post('url', 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034))
    feed.append(Post('url', 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000))
    feed.append(Post('url', 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51))

    return feed

*/
//function that creates data for the MessagesPage 
export function createMessages(){
    //creating list

    var messages = new Array<Message>;
 
    //appending instances to list
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'shane', 'shane17', 'Feb 21, 2023', 'Yo, long time no see'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'hanna nurkic', 'hannaBanana4', 'Apr 2, 2022', 'Its finally springtime'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'george', 'GLopez15', 'Apr 26, 2023', 'ba ba ba ba ba ba buh, ba da da buh buh, ba ba ba ba ba ba buh, ba da da buh buh'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'miguel', 'oharaM', 'Dec 25, 2021', 'Merry merry, to all!'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'bean', 'littlebean1', 'Mar 10, 2022', 'Mewo mewoi, meow'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'shane', 'shane17', 'Feb 21, 2023', 'Yo, long time no see'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'hanna nurkic', 'hannaBanana4', 'Apr 2, 2022', 'Its finally springtime'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'george', 'GLopez15', 'Apr 26, 2023', 'ba ba ba ba ba ba buh, ba da da buh buh, ba ba ba ba ba ba buh, ba da da buh buh'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'miguel', 'oharaM', 'Dec 25, 2021', 'Merry merry, to all!'));
    messages.push(new Message('../../../../assets/images/elon.jpeg', 'bean', 'littlebean1', 'Mar 10, 2022', 'Mewo mewoi, meow'));

    return messages;
}
/*
//function that creates data for the notification page
def createNotifications():
    # creating list
    notifications = []
 
    # appending instances to list
    notifications.append(Notification('Heart', 'images/elon.jpeg', 'shane', 'words words words'))
    notifications.append(Notification('News', 'images/elon.jpeg', 'hanna', 'sentence setenc esnetence'))
    notifications.append(Notification('Retweet', 'images/elon.jpeg', 'george', 'paragraph paragraph paragraph paragraph'))
    notifications.append(Notification('Heart', 'images/elon.jpeg', 'barry', 'more words more words more words'))
    notifications.append(Notification('News', 'images/elon.jpeg', 'windsor police', 'we caught the guy'))
    notifications.append(Notification('Heart', 'images/elon.jpeg', 'shane', 'words words words'))
    notifications.append(Notification('News', 'images/elon.jpeg', 'hanna', 'sentence setenc esnetence'))
    notifications.append(Notification('Retweet', 'images/elon.jpeg', 'george', 'paragraph paragraph paragraph paragraph'))
    notifications.append(Notification('Heart', 'images/elon.jpeg', 'barry', 'more words more words more words'))
    notifications.append(Notification('News', 'images/elon.jpeg', 'windsor police', 'we caught the guy'))
    
    return notifications

//function that creates data for the search page
def createSearchTopics():
    # creating list
    topics = []
 
    # appending instances to list
    topics.append(SearchTopic('Music', 'Big Sean', 12005))
    topics.append(SearchTopic('Music', 'Lil Wayne', 100))
    topics.append(SearchTopic('Food', 'Macoroni', 60000))
    topics.append(SearchTopic('Sports', 'McJesus', 120550))
    topics.append(SearchTopic('Art', 'Banksy', 7903))
    
    return topics

//function that creates data for profiles
def createProfiles():
    # creating list
    profiles = []
 
    # appending instances to list
    profiles.append(Profile('images/elon.jpeg', 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', shortenNum(200), shortenNum(150)))
    profiles.append(Profile('images/elon.jpeg', 'Barry', 'cuddlyBar', 'always be the best bear you can be!', shortenNum(2305), shortenNum(5000)))
    profiles.append(Profile('images/elon.jpeg', 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', shortenNum(150), shortenNum(4500)))
    profiles.append(Profile('images/elon.jpeg', 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', shortenNum(200), shortenNum(150)))
    profiles.append(Profile('images/elon.jpeg', 'Barry', 'cuddlyBar', 'always be the best bear you can be!', shortenNum(2305), shortenNum(5000)))
    profiles.append(Profile('images/elon.jpeg', 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', shortenNum(150), shortenNum(4500)))
    
    return profiles

*/
