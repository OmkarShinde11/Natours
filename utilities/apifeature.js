class APIFeature{
    constructor(query,queryString){
        this.query=query,
        this.queryString=queryString
    }

    fliter(){
        let queryObj={...this.queryString};
        // console.log(queryObj);

        //excluding the page sort limit fields
        const optionArray=['page','sort','limit','fields'];
        optionArray.forEach(el=>delete queryObj[el]);

        // make query string with $ if opertaor present
        // why we add this code beacuse we need this { difficulty: 'easy', duration: { '$gte': '5' } } query, but from req.query.params we get object like { difficulty: 'easy', duration: { '$gte': '5' } }
        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
        // console.log(JSON.parse(queryStr));
        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ');
            // console.log(sortBy);
            this.query=this.query.sort(sortBy);
        }
        else{
            this.query=this.query.sort('-createdAt');
        }
        return this;
    }

    selectFields(){
        if(this.queryString.fields){
            const fields=this.queryString.fields.split(',').join(' ');
            // console.log(fields);
            this.query=this.query.select(fields);
        }
        else{
            this.query=this.query.select('-__v');
        }
        return this;
    }

    Pagination(){
        let page=Number(this.queryString.page) || 1;
        let limit=Number(this.queryString.limit) || 100;
        let skip=(page-1) * limit;
        // console.log(skip)
        this.query=this.query.skip(skip).limit(limit);
        return this;
    }
    
}

module.exports=APIFeature;