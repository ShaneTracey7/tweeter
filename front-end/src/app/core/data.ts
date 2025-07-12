


//sets images with correct url
//only for switching from publishing to github pages to development
export function getImgUrl(str:string)
{
    let inDev = true;
    
    if(inDev == true)
        {
            if(str.startsWith('http'))
            {
                return str;
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
export function getProfileImgUrl(str:string)
{
    let inDev = true; //might need to change this later
    
    if(inDev)
        {
            if(str == null || str == "")
            {
                return "../../../../assets/images/" + 'default-profile-pic.jpg';
            }
            else
            {
                return str;
            }
        }
    else
        {   
            if(str == null|| str == "")
            {
                return "/tweeter/assets/images/" + 'default-profile-pic.jpg'; //may need to fix path
            }
            else
            {
                return str;
            } 
        }
}
export function getHeaderImgUrl(str:string)
{
    let inDev = true; //might need to change this later
    
    if(inDev)
        {
            if(str == null)
            {
                return "../../../../assets/images/" + 'default-header-pic.png';
            }
            else
            {
                return str;
            }
        }
    else
        {   
            if(str == null)
            {
                return "/tweeter/assets/images/" + 'default-header-pic.png'; //may need to fix path
            }
            else
            {
                return str;
            } 
        }
}

function setGoogleDriveImg()
{
    /*
    doesn't work as is 
    URL url = new URL("http://www.somesite.com/picture.jpg");

    URLConnection urlCon = url.openConnection();
    urlConn.setRequestProperty("Referer", "http://www.somesite.com");
    urlConn.connect();

    InputStream urlStream = urlCon.getInputStream();

    Image image = ImageIO.read(urlStream);
    */
}

//Global variables (for test data)
export var elon: string = getImgUrl('elon.jpeg');

export class Post {
    id: number; //needed for accessing db tweets(posts)
    profile: string; //url
    username: string;
    acc_name: string; 
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

//formats class attributes of type number
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
        console.log("hours: " + hours)
        var suffix;
        if (hours <= 11)
            {
                suffix = "AM";

                if(hours == 0)
                {
                    hours = 12;
                }
            }
        else if(hours == 12)
            {
                suffix = "PM";
            }
        else
            {
                hours = Number(hours - 12);
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
    otherUser: Profile;
    messages: Message []; //actual conversation
   
    constructor(id: number, u: Profile, m: Message [], d: Date) {
        this.id = id;
        this.otherUser = u;
        this.messages = m;
        this.startDate =d;
      }

    //returns a string to be used as text displayed in convo html element
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

    //returns a string to be used as date displayed in convo html element
    getLastMessageDate()
    {
        let today = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var date;
        var month;
        if(this.messages.length > 0)
        {   
            date = new Date(this.messages[(this.messages.length-1)].date);
            console.log('has a date: ' + date);
            console.log('has a client side: ' + today);
            month = monthNames[(date.getMonth())];

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
    }
}

//function that creates data for the search page

export function createSecondarySearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Art', 'Mona Lisa', 7903));
    topics.push( new SearchTopic('Music', 'Justin Bieber', 12005));
    topics.push( new SearchTopic('Food', 'Macoroni', 60000));
    topics.push( new SearchTopic('Music', 'Taylor Swift', 100));
    topics.push( new SearchTopic('Sports', 'McDavid', 120550));
    
    return topics;
}


export function createForYouSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Sports', 'Kobe', 7903));
    topics.push(new SearchTopic('Art', 'Mona Lisa', 7903));
    topics.push( new SearchTopic('Music', 'Justin Bieber', 12005));
    topics.push( new SearchTopic('Food', 'Macoroni', 60000));
    topics.push( new SearchTopic('Music', 'Taylor Swift', 100));
    topics.push( new SearchTopic('Sports', 'McDavid', 120550));
    
    return topics;
}

export function createTrendingSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Politics', 'Elon', 7903));
    topics.push( new SearchTopic('Music', 'Big Sean', 12005));
    topics.push( new SearchTopic('Music', 'Lil Wayne', 100));
    topics.push( new SearchTopic('Food', 'Ravioli', 60000));
    topics.push( new SearchTopic('Sports', 'Serena Williams', 120550));
    topics.push(new SearchTopic('Art', 'Da Vinci', 7903));
    
    return topics;
}

export function createNewsSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Politics', 'CAD', 7903));
    topics.push( new SearchTopic('Sports', 'Super Bowl', 12005));
    topics.push( new SearchTopic('Food', 'Dairy', 60000));
    topics.push( new SearchTopic('Politics', 'Trudeau', 60000));
    topics.push( new SearchTopic('Music', 'Morgan Wallen', 12005));
    topics.push( new SearchTopic('Politics', 'Kamala Harris', 6750));
    
    return topics;
}

export function createSportsSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Sports', 'Brooke Henderson', 7903));
    topics.push( new SearchTopic('Sports', 'Eagles', 100));
    topics.push( new SearchTopic('Sports', 'Mahomes', 60000));
    topics.push( new SearchTopic('Sports', 'Caitlin Clark', 12005));
    topics.push( new SearchTopic('Sports', 'McDavid', 120550));
    topics.push(new SearchTopic('Sports', 'Mike Trout', 7903));
    
    return topics;
}

export function createEntertainmentSearchTopics(){
    // creating list
    var topics = new Array<SearchTopic>;
 
    //appending instances to list
    topics.push(new SearchTopic('Art', 'Banksy', 7903));
    topics.push( new SearchTopic('Music', 'Beyonce', 12005));
    topics.push( new SearchTopic('Music', 'Drake', 100));
    topics.push( new SearchTopic('Food', 'Gordon Ramsay', 60000));
    topics.push( new SearchTopic('Music', 'Lady Gaga', 120550));
    topics.push(new SearchTopic('Film', 'Michael Scott', 7903));
    
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
    return topics;
}

//idk if this is in use
export function getProfile(username: string, profiles: Profile[]){
    
    for (var profile of profiles) {
       if(username == profile.username)
        {
            return profile;
        }
   }
    return new Profile('','','','','',0,0);
 }
