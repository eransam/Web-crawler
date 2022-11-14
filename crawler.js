// Request is designed to be the simplest way possible to make http calls
//   שזה אומר שהוא מקבל כתובת יואראל ופונ' אשר תחול על היואראל request(url,(error,response,html)=>{}) = הסינטקסט של הסיפריה הוא 
//html של האתר הנסרק יהיה בתוך המשתנה  html ובמידה והרספונס סטטוס הוא 200 אז הבקשה עברה בהצלחה ואז כל ה
var request= require("request");

//וכך זימנו אותה לפרוייקט שלנו npm i node-localstorage הורדנו את סיפריית הלוקל סטורג' לנוד 
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }




// מייביאים את סיפריית הסקראפינג
var cheerio= require("cheerio");

// מייבאים את הסיפריה שיוצרת קבצים
var fs= require("fs");

// var readline= require('readline');

// משתנה שבעתיד יכיל את כל רשימת הלינקים והתמונות
var siteMap = [];

// מערך שיכיל את לינקי הדפים לסריקה
var arrUrl =[];

// עומק
var depth = 2;

//fs שם התיקייה והקבצים אותם ניצור בהמשך דרך
var FileName = "MyTest";

// כתובת היואראל הראשונה לסריקה
const oneUrl= "https://wiprodigital.com";

arrUrl.push(oneUrl);


//url כאן אנו ניצור אובייקט המכיל 3 מערכים שבעתיד יכילו את המידע המבוקש שאני נרצה להוציא מה 
siteMap= {
    linksUnderTheSameDomain: [],
    externalLinks: [],
    images: []
};




// const arr = [];


exports.crawl= async function(){

    // לולאה אשר תרוץ מספר פעמים זהה לערך העומק
    for (let index = 0; index < depth; index++) {
        if (index>0) {
            const str123 = await localStorage.getItem('myFirstKey')
            arrUrl = JSON.parse(str123);
        }


    // במידה ויש ערך במשתנה
   if (arrUrl) {
    
  
    for (const url of arrUrl) {
        console.log(url);
    //וכפרמטר ראשון אנו נותנים לה את הכתובת לסריקה request אשר זימנו מסיפריית  request ובתוכה אנו מפעילים את פונ ה
    // וכפרמטר שני אנו נותנים לה את הפונ המובנת אשר מקבלת 3 פרמטרים
     request(url, function(error, response, html){
        if(!error){

            //$ תחת המשתנה  cheerioאנו נטען לסיפריית ה html  ואת כל ה  request שהכנסנו לפונ ה url מהכתובת  htmlהוא פלט ה html הפרמטר
            var $ = cheerio.load(html);

            //($) url אשר נמצאים ב  [href] כך אנו נעבור על כל התגים - $("*[href]").each
            //link וכל הערך אשר נמצא תחת התגים הזו אנו נכניס לתוך המשתנה 
            $("*[href]").each(function(){
                var link= $(this).attr('href');
                
                //הרצוי לסריקה זה אומר שהלינק הזה הוא urlאם הלינק אשר נמצא בדף הסריקה מתחיל עם ה = startsWith
                // תחת אותו דומיין
                if( link.startsWith(url) ){

                    //האם כבר קיים לינק כזה בתוך האובייקט שלנו indexOf לאחר מכן אנו בודקים בעזרת הפונ 
                    // במידה ולא אז פונ זו תחזיר -1 ואז אנו נוסיף את הלינק הזה לאובייקט תחת המערך של הלינקים עם אותו
                    if(siteMap.linksUnderTheSameDomain.indexOf(link)== -1)
                        siteMap.linksUnderTheSameDomain.push(link);
                }

                //ובמידה והוא לא  html כאן אנו שואלים האם הלינק שלנו הוא לא לינק לסקשיין מסויים או לקובץ 
                // *לינק שמתחיל ב- / יעול להיות תמונה
                //externalLinks אנו נבין שזה לינק רגיל חיצוני ונכניס אותי לתוך האובייקט שלנו תחת הפרופרטי 
                else if( !link.startsWith('/') && !link.startsWith('#') ){

                    //האם כבר קיים לינק כזה בתוך האובייקט שלנו indexOf לאחר מכן אנו בודקים בעזרת הפונ 
                    // במידה ולא אז פונ זו תחזיר -1 ואז אנו נוסיף את הלינק הזה לאובייקט תחת המערך של הלינקים עם אותו
                    if(siteMap.externalLinks.indexOf(link)== -1)
                        siteMap.externalLinks.push(link);
                }
    
                // במידה והלינק מסתיים בסיומות הנבחרות אנו נבין שזה לינק של תמונות ואנו נכניס אותך לפרופרטי באובייקט המבוקש
                if(link.endsWith('.jpeg') || link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.gif') || link.endsWith('.tiff')){
                    
                    //האם כבר קיים לינק כזה בתוך האובייקט שלנו indexOf לאחר מכן אנו בודקים בעזרת הפונ 
                    // במידה ולא אז פונ זו תחזיר -1 ואז אנו נוסיף את הלינק הזה לאובייקט תחת המערך של הלינקים עם אותו
                    if(siteMap.images.indexOf(link)== -1)
                        siteMap.images.push(link);
                }
    
            });
            
            // לאחר שהכנסו את הלינקים למקומות המבוקשים באובייקט שלנו אנו נעשה את אותה פעולת חילות גם על לינקים
            //וכך נחלץ באמת את כל הלינקים שבדף [src] השתחת התגית 
            $("*[src]").each(function(){
                var link= $(this).attr('src');
                
                // כנ''ל
                if( link.startsWith(url) ){
                    if(siteMap.linksUnderTheSameDomain.indexOf(link)== -1)
                        siteMap.linksUnderTheSameDomain.push(link);
                }

                // כנ''ל
                else if( !link.startsWith('/') && !link.startsWith('#') ){
                    if(siteMap.externalLinks.indexOf(link)== -1)
                    siteMap.externalLinks.push(link);
                }

                // כנ''ל
                if(link.endsWith('.jpeg') || link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.gif') || link.endsWith('.tiff')){
                    if(siteMap.images.indexOf(link)== -1)
                        siteMap.images.push(link);
                }
            });


            
     
            // console.log("siteMap :" ,siteMap.externalLinks);
            //arr לאחר מכן אנו נידחוף את כל האובייקט הזה למערך בשם 
            // arr.push(siteMap);

            //logic to write to files
            //(./) הנמצא תיקייה אחת למעלה ממיקום זה siteMap כאן אנו בודקים אם אין בפרוייקט שלנו קובץ בשם 
            if (!fs.existsSync('./siteMap')){

                // ובמידה ולא אנו נייצר תיקייה בשם כזה
                fs.mkdirSync('./siteMap');
            }

            // "" המכיל כרגע את ערך ריק  siteMap.txt ולאחר מיכן אנו נייצר קובץ בתוך התיקייה הזו בשם
            fs.writeFileSync(`./siteMap/${FileName + index}.txt`, '');
            
            // לאחר מכן אנו נכניס את הסטרינג הזה לקובץ
            fs.appendFileSync(`./siteMap/${FileName + index}.txt`, 'Links Under The Same Domain\n\n');
            
            //ונכניס לינק לינק לתוך הקובץ שיצרנו linksUnderTheSameDomain על כל האובייקטים הנמצאים בתוך הפרופרטי forEach ולאחר מכן אנו נרוץ בעזרת הפונ 
            siteMap.linksUnderTheSameDomain.forEach(function(link){
                fs.appendFileSync(`./siteMap/${FileName + index}.txt`, link+'\n');
            });
    
            fs.appendFileSync(`./siteMap/${FileName + index}.txt`, '\n\n\n');
    
            // לאחר מכן נעשה את אותה פעולה על הלינקים מהפרופרטי הנוספים
            fs.appendFileSync(`./siteMap/${FileName + index}.txt`, 'External Links\n\n');
    
            // כנ''ל
            siteMap.externalLinks.forEach(function(link){
                fs.appendFileSync(`./siteMap/${FileName + index}.txt`, link+'\n');
            });

            // כנ''ל
            fs.appendFileSync(`./siteMap/${FileName + index}.txt`, '\n\n\n');
    
            // כנ''ל
            fs.appendFileSync(`./siteMap/${FileName + index}.txt`, 'Images\n\n');
            
            // כנ''ל
            siteMap.images.forEach(function(link){
                fs.appendFileSync(`./siteMap/${FileName + index}.txt`, link+'\n');
            });
    

            //הפרמטר הראשון של פונ זו הוא הערכים שאותם אנו נרצה להפוך לסטרינג =  JSON.stringify(siteMap, null, 2)
            // (siteMap) הפרמטר השני זה פונ שאנו נרצה להכניס כדי לשנות התנהגות מסויימת של הערכים
            // הפרמטר השלישי הוא כמות הרווחים בכל רווח הקיים בסטרינג שנוצר,   
            //  לדוג: עם יש בסטרינג רווח אחד אז הרווח הזה יהפוך ל2 רווחים
            fs.writeFileSync(`./siteMap/${FileName + index}.json`, JSON.stringify(siteMap, null, 2));
             const tt = siteMap.externalLinks
             const notesArrayJson = JSON.stringify(tt);
              localStorage.setItem('myFirstKey', notesArrayJson);
    
        }


    });

    }   
} 


}


};