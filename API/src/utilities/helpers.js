const randomStringGenerator = (len)=>
    {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const length = chars.length;
        let random = ""
        for (let i =0; i< len; i++){
            const posn = Math.ceil(Math.random()* length)
            random+= chars[posn]
        }
        return random;
    }