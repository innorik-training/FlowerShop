import NavBar from "../../components/navbar";
import { useSearchParams, useParams } from 'react-router-dom'
import { useEffect, useState } from "react";
import BuyFlowers from "../home/components/buyFlowers";
import { rawData } from "../../utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import MyModal from "../../components/dropdown";



const SearchPage = () => {

    const STEP = 0.1;
    const MIN = 0;
    const MAX = 100;

    const [data, setData] = useState<rawData[]>();
    const [filterInput, setFilterInput] = useState(false);
    const [searchResults, setSearchResults] = useState<rawData[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterCategory, setFilterCategory] = useState('All');






    console.log(searchParams.get('query'));


function sortByCategory(value:string, data:rawData[]){
    var filteredValue: rawData[];
    if (value !== 'All') {
        filteredValue = data.filter((cartItem: rawData) => cartItem.category.toLowerCase().includes(value.toString().toLowerCase()));
        setSearchResults(filteredValue);
        setFilterInput(true);
        
    }
    else{
        filteredValue = data;
        setSearchResults(filteredValue);
        setFilterInput(true);
    }

    setSearchParams({query:searchParams.get('query')!.toString(),category: value, })

    return filteredValue;
}

function sortByRange(rangeOfValues : number[], processedData: rawData[]){
    var filteredValue: rawData[];
    filteredValue = processedData.filter((cartItem: rawData) => (parseInt(cartItem.price) >= rangeOfValues[0]) && parseInt(cartItem.price) <= rangeOfValues[1] );
    setSearchResults(filteredValue);
    setFilterInput(true);
    // setSearchParams({range: rangeOfValues.toString()})
    setSearchParams({query:searchParams.get('query')!.toString(),category: searchParams.get('category')!.toString(),
range: rangeOfValues.toString()
})
    
}


    async function sortData(value: string, rangeVal : number[]) {
        console.log(`this is for rangeVal ${rangeVal} the first is ${rangeVal[0]} and second is ${rangeVal[1]}`);
        setFilterCategory(value);
        console.log(`this is filtered ${filterCategory}`);
        var filteredValue: rawData[];

       
            if (data) {
            var results =   await sortByCategory(value, data);
               await sortByRange(rangeVal, results)


        
        }
      
    }

    useEffect(() => {
        fetch('http://localhost:8000/flowers').then(res => {
            return res.json();
        }).then(data => {

            //Fetch data
            console.log(data);

            console.log(`searrhr worss ${searchParams.get('query')}`);
            console.log(`searrhr worss ${searchParams.get('category')}`);
            if (searchParams.get('query') === '' || searchParams.get('query') === undefined || searchParams.get('query') === null) {
                var filteredValue = data;
                setSearchResults(filteredValue);
                setData(filteredValue);
                setFilterInput(true);
            } else {
                var filteredValue = data.filter((cartItem: rawData) => {
                    var pattern1 = `\[${cartItem.name.toLowerCase()}\]`;
                    if(searchParams.get('query')!.toString().toLowerCase().match(new RegExp(pattern1, 'g'))?.length! >= searchParams.get('query')!.toString().length){
                        console.log(`tadaaa ${cartItem.name}`);
                        return cartItem;
                   
                    }})
                   setData(filteredValue);
                console.log(`the filter category is ${filterCategory}`)
                if(filterCategory !== "All"){
                    filteredValue = filteredValue.filter((cartItem: rawData) => cartItem.category.toLowerCase().includes(filterCategory.toString().toLowerCase()));
                    setSearchResults(filteredValue);
                    // setData(filteredValue);
                    setFilterInput(true);
                }else{
                    setSearchResults(filteredValue);
                    
                    // setData(filteredValue);
                    setFilterInput(true);
                }
               
                

            }
        })
    }, [searchParams.get('query')]);

    function search(e: string) {

        console.log(e);
        console.log('starting search ');
        if (data) {
            console.log(data);
            if (e === '') {
                setFilterInput(false)
            } else {
            }
        }
    }



    return (<div>
        <NavBar />
        <div className="lg:px-10 px-1 flex flex-row justify-between items-center h-10 bg-white border-t-2  ">
            <div className="flex flex-none">
                <em>You searched : <strong>{searchParams.get('query')}</strong></em>
            </div>





            
            <MyModal handle={(data: string, rangeVal: number[]) => {sortData(data, rangeVal); setFilterCategory(data);}} />

        </div>
        <div className="mx-2 lg:mx-20 mt-5">
            <div className="h-screen ">

                <div className="flex flex-wrap justify-center ">

                    {filterInput && searchResults.map((flower: rawData) => {
                        return (
                            <div className="lg:my-5 my-1 mx-5 " key={flower.id}>
                                <BuyFlowers flowerId={flower.id} flowerName={flower.name} flowerUrl={flower.url} flowerDate={flower.date} flowerTitle={flower.title} flowerBody={flower.body} flowerPrice={flower.price} flowerQty={1} />
                            </div>

                        )
                    })}
                    {filterInput && searchResults.length < 1 && <div>No Item Found</div>}
                    {!filterInput && data && data.map((flower: rawData) => {
                        return (
                            <div className="lg:my-5 my-1  mx-5" key={flower.id}>
                                <BuyFlowers flowerId={flower.id} flowerName={flower.name} flowerUrl={flower.url} flowerDate={flower.date} flowerTitle={flower.title} flowerBody={flower.body} flowerPrice={flower.price} flowerQty={1} />
                            </div>

                        )
                    })}
                </div>


            </div>

        </div>

    </div>);
}

export default SearchPage;