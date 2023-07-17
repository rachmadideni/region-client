const capitalizedSentences = (text) => {
    const sentences = text.split(' ');
    const capitalizedSentences = sentences.map((sentence,idx) => idx === 0 ? sentence.charAt(0).toUpperCase() + sentence.slice(1) : sentence);
    // console.log(capitalizedSentences)
    return capitalizedSentences.join(' ');
}

export {
    capitalizedSentences
}