// Request is designed to be the simplest way possible to make http calls
//   שזה אומר שהוא מקבל כתובת יואראל ופונ' אשר תחול על היואראל request(url,(error,response,html)=>{}) = הסינטקסט של הסיפריה הוא 
//html של האתר הנסרק יהיה בתוך המשתנה  html ובמידה והרספונס סטטוס הוא 200 אז הבקשה עברה בהצלחה ואז כל ה
var request= require("request");

// מייביאים את סיפריית הסקראפינג
var cheerio= require("cheerio");

// מייבאים את הסיפריה שיוצרת קבצים
var fs= require("fs");

var readline= require('readline');

const url= "https://wiprodigital.com";
const dp= 2;





const arr = [];

console.log("eran");


// כאן אנו יוצרים משתנה אשר מכיל פונקצית קול-באק
exports.crawl= function(callback){

    //וכפרמטר ראשון אנו נותנים לה את הכתובת לסריקה request אשר זימנו מסיפריית  request ובתוכה אנו מפעילים את פונ ה
    // וכפרמטר שני אנו נותנים לה את הפונ המובנת אשר מקבלת 3 פרמטרים
    request(url, function(error, response, html){
        if(!error){

            //$ תחת המשתנה  cheerioאנו נטען לסיפריית ה html  ואת כל ה  request שהכנסנו לפונ ה url מהכתובת  htmlהוא פלט ה html הפרמטר
            var $ = cheerio.load(html);
            
            //url כאן אנו ניצור אובייקט המכיל 3 מערכים שבעתיד יכילו את המידע המבוקש שאני נרצה להוציא מה 
            var siteMap= {
                linksUnderTheSameDomain: [],
                externalLinks: [],
                images: []
            };


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
            arr.push(siteMap);

            //logic to write to files
            //(./) הנמצא תיקייה אחת למעלה ממיקום זה siteMap כאן אנו בודקים אם אין בפרוייקט שלנו קובץ בשם 
            if (!fs.existsSync('./siteMap')){

                // ובמידה ולא אנו נייצר תיקייה בשם כזה
                fs.mkdirSync('./siteMap');
            }

            // "" המכיל כרגע את ערך ריק  siteMap.txt ולאחר מיכן אנו נייצר קובץ בתוך התיקייה הזו בשם
            fs.writeFileSync('./siteMap/siteMap.txt', '');
            
            // לאחר מכן אנו נכניס את הסטרינג הזה לקובץ
            fs.appendFileSync('./siteMap/siteMap.txt', 'Links Under The Same Domain\n\n');
            
            //ונכניס לינק לינק לתוך הקובץ שיצרנו linksUnderTheSameDomain על כל האובייקטים הנמצאים בתוך הפרופרטי forEach ולאחר מכן אנו נרוץ בעזרת הפונ 
            siteMap.linksUnderTheSameDomain.forEach(function(link){
                fs.appendFileSync('./siteMap/siteMap.txt', link+'\n');
            });
    
            fs.appendFileSync('./siteMap/siteMap.txt', '\n\n\n');
    
            // לאחר מכן נעשה את אותה פעולה על הלינקים מהפרופרטי הנוספים
            fs.appendFileSync('./siteMap/siteMap.txt', 'External Links\n\n');
    
            // כנ''ל
            siteMap.externalLinks.forEach(function(link){
                fs.appendFileSync('./siteMap/siteMap.txt', link+'\n');
            });

            // כנ''ל
            fs.appendFileSync('./siteMap/siteMap.txt', '\n\n\n');
    
            // כנ''ל
            fs.appendFileSync('./siteMap/siteMap.txt', 'Images\n\n');
            
            // כנ''ל
            siteMap.images.forEach(function(link){
                fs.appendFileSync('./siteMap/siteMap.txt', link+'\n');
            });
    

            //הפרמטר הראשון של פונ זו הוא הערכים שאותם אנו נרצה להפוך לסטרינג =  JSON.stringify(siteMap, null, 2)
            // (siteMap) הפרמטר השני זה פונ שאנו נרצה להכניס כדי לשנות התנהגות מסויימת של הערכים
            // הפרמטר השלישי הוא כמות הרווחים בכל רווח הקיים בסטרינג שנוצר,   
            //  לדוג: עם יש בסטרינג רווח אחד אז הרווח הזה יהפוך ל2 רווחים
            fs.writeFileSync('./siteMap/siteMap.json', JSON.stringify(siteMap, null, 2));
            console.log("siteMap :" ,typeof(siteMap.externalLinks));
            
            let ex = siteMap.externalLinks;
            console.log("ex: " , ex);
for (let index = 0; index < dp; index++) {
for (const iterator of ex) {
    console.log("iterator: " , iterator);

        (callback)=>{

        request(iterator, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
        
                var siteMap= {
                    linksUnderTheSameDomain: [],
                    externalLinks: [],
                    images: []
                };
    
    
                $("*[href]").each(function(){
                    var link= $(this).attr('href');
        
                    if( link.startsWith(url) ){
                        if(siteMap.linksUnderTheSameDomain.indexOf(link)== -1)
                            siteMap.linksUnderTheSameDomain.push(link);
                    }
                    else if( !link.startsWith('/') && !link.startsWith('#') ){
                        if(siteMap.externalLinks.indexOf(link)== -1)
                            siteMap.externalLinks.push(link);
                    }
        
                    if(link.endsWith('.jpeg') || link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.gif') || link.endsWith('.tiff')){
                        if(siteMap.images.indexOf(link)== -1)
                            siteMap.images.push(link);
                    }
        
                });
        
                $("*[src]").each(function(){
                    var link= $(this).attr('src');
        
                    if( link.startsWith(url) ){
                        if(siteMap.linksUnderTheSameDomain.indexOf(link)== -1)
                            siteMap.linksUnderTheSameDomain.push(link);
                    }
                    else if( !link.startsWith('/') && !link.startsWith('#') ){
                        if(siteMap.externalLinks.indexOf(link)== -1)
                        siteMap.externalLinks.push(link);
                    }
        
                    if(link.endsWith('.jpeg') || link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.gif') || link.endsWith('.tiff')){
                        if(siteMap.images.indexOf(link)== -1)
                            siteMap.images.push(link);
                    }
                });
    
    
                
         
                // console.log("siteMap :" ,siteMap.externalLinks);
                arr.push(siteMap);
    
                //logic to write to files
                if (!fs.existsSync(`./siteMap`)){
                    fs.mkdirSync(`./siteMap`);
                }
    
                fs.writeFileSync(`./siteMap/siteMap${index}.txt`, '');
        
                fs.appendFileSync(`./siteMap/siteMap${index}.txt`, 'Links Under The Same Domain\n\n');
        
                siteMap.linksUnderTheSameDomain.forEach(function(link){
                    fs.appendFileSync(`./siteMap/siteMap${index}.txt`, link+'\n');
                });
        
                fs.appendFileSync(`./siteMap/siteMap${index}.txt`, '\n\n\n');
        
        
                fs.appendFileSync(`./siteMap/siteMap${index}.txt`, 'External Links\n\n');
        
                siteMap.externalLinks.forEach(function(link){
                    fs.appendFileSync(`./siteMap/siteMap${index}.txt`, link+'\n');
                });
        
                fs.appendFileSync(`./siteMap/siteMap${index}.txt`, '\n\n\n');
        
        
                fs.appendFileSync(`./siteMap/siteMap${index}.txt`, 'Images\n\n');
        
                siteMap.images.forEach(function(link){
                    fs.appendFileSync(`./siteMap/siteMap${index}.txt`, link+'\n');
                });
        
                fs.writeFileSync(`./siteMap/siteMap${index}.json`, JSON.stringify(siteMap, null, 2));
    
    
                if(callback) callback("SUCCESS");
            }
            else{
                if(callback) callback("ERROR");
            }
        });
    
    
    };

    



    
}
    
}


            if(callback) callback("SUCCESS");
        }
        else{
            if(callback) callback("ERROR");
        }
    });


};



