const mysql         = require('mysql')
const config        = require('../mysql/config')
var pool            = mysql.createPool({
    host            : config.host,
    user            : config.user,
    password        : config.password,
    database        : config.database,
    connectionLimit : 100
})

module.exports = {        
    async root(req, res, next){                
        pool.getConnection(function(err,connection){
            if (err) {
                res.status(500).send({ status: 'Internal Server Error', error: 'Database connection fail' })
                return
            }  
            //parameters from request
            let {lat, lon} = req.body   
              
            //query for only top scores
            var query1 = 'SELECT name, age, getDistance(latitude,longitude,' + lat +','+ lon +') distance, '                        //default fields
            query1 += '(score + if(getDistance(latitude,longitude,' + lat +','+ lon +') <10000,1,0))score '                         //add distance score
            query1 += 'FROM tbl_patients '                                                                                                         //chance for low score patients (see randam code right above)
            query1 += 'order by (score + if(getDistance(latitude,longitude,' + lat +','+ lon +') <10000,10,0)) desc, name asc '     //order by score, name
            query1 += 'limit 10'                                                                                                   //results limit        
            
            //random score for 3 less than 6 socre patients
            let less_score = Math.floor(Math.random() * 6); 

            //query for 3 less than 6 score patients get top chances
            var query2 = '(SELECT * FROM ( ' 
            query2 += '    SELECT name, age, getDistance(latitude,longitude,' + lat +','+ lon +') distance, ' 
            query2 += '    (score + if(getDistance(latitude,longitude,' + lat +','+ lon +') <10000,1,0))score '  
            query2 += '    FROM tbl_patients ' 
            query2 += '    where score < '+less_score+' order by (score + if(getDistance(latitude,longitude,' + lat +','+ lon +') <10000,10,0)) desc, name asc limit 3 '
            query2 += '    )as A) '
            query2 += 'union '
            query2 += '(SELECT * FROM ( '
            query2 += '    SELECT name, age, getDistance(latitude,longitude,' + lat +','+ lon +') distance, ' 
            query2 += '    (score + if(getDistance(latitude,longitude,' + lat +','+ lon +') <10000,1,0))score  '
            query2 += '    FROM tbl_patients order by (score + if(getDistance(latitude,longitude,' + lat +','+ lon +') <10000,10,0)) desc, name asc limit 10 '
            query2 += ' )as B) '

            //random chance for low score patients
            let sql = query1
            let val = Math.floor(Math.random() * 100);            
            if (val > 69)  sql = query2   //30% chance for 3 less then 6 score patients               

            connection.query(sql,function(err,rows){
                if(!err) {                                       
                    if (rows.length >0){
                        //object assembly with database results
                        let dados = []

                        //assures that only 10 rows will be showed
                        for (x=0; x<10; x++){
                            let {name, age, score} = rows[x]                            
                            dados.push({name,age,score})
                        }                        
                        
                        res.status(200).send(dados)
                    }else {
                        res.status(200).send({ status: 'OK', error: 'No patients found' })
                    }
                }else{                    
                    res.status(500).send({ status: 'Internal Server Error', error:'Invalid query' })
                    return           
                }
            })
        })         
    }, 
}