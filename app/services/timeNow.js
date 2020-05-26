module.exports = ()=>{
    let dateGenerator = new Date();
    return `${dateGenerator.getUTCFullYear()}/${dateGenerator.getUTCHours()}/${dateGenerator.getUTCDate()}-${dateGenerator.getUTCHours()}:${dateGenerator.getUTCMinutes()}`;
}
