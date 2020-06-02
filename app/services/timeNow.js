var TimeStamp = ()=>{
    let dateGenerator = new Date();
    return `${dateGenerator.getUTCFullYear()}/${dateGenerator.getUTCHours()}/${dateGenerator.getUTCDate()}-${dateGenerator.getUTCHours()}:${dateGenerator.getUTCMinutes()}`;
}

export default TimeStamp;
