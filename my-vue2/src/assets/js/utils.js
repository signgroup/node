const formatDate=(date,type)=> {
    const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    const d = new Date(date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hour = d.getHours()
    const minute = d.getMinutes()
    const second = d.getSeconds()
    let result=''
    switch (type) {
        case 1:
            result=[year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
            break;
        case 2:
            result=[year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
            break;
        default:
            break

    }

    return result
}

export default {
    formatDate
}
