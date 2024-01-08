const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const convertToLakh = (amount) =>  {
    if (amount >= 1000 && amount < 100000) {
   return Math.sign(amount)*((Math.abs(amount)/1000).toFixed(1)) + 'k'
    } else if (amount >= 100000 && amount < 10000000) {
      let  lakhAmount = (amount / 100000).toFixed(1) + 'Lakh';
      return lakhAmount
    }  else if(amount >= 10000000){
      let  crAmount = (amount / 10000000).toFixed(1) + 'Cr';
      return crAmount
    } else {
      return numberWithCommas(amount.toFixed(1))
    }
  }

export {numberWithCommas,convertToLakh}