import { useQuery } from 'react-query';
import axios from "axios";


export const getSahko = async (year,month,day) => {
    const tunnit = 24;
    const data = await axios.get(`https://www.sahkohinta-api.fi/api/v1/halpa?tunnit=${tunnit}&tulos=haja&aikaraja=${year}-${month}-${day}`)
    return data
}

const SahkoQuery = useQuery(['sahko', year, month, day], () => getSahko(year,month,day));


