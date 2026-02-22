export const getInitialDate = () => {
    const d = new Date()
    if (d.getDay() === 0) d.setDate(d.getDate() + 1)
    else if (d.getDay() === 6) d.setDate(d.getDate() + 2)
    return d
}
