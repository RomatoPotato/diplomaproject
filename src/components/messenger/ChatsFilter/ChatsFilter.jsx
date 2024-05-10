import React, {useEffect, useRef, useState} from 'react';
import "./ChatsFilter.css";
import SpecialtiesService from "../../../services/SpecialtiesService";

const ChatsFilter = ({onSearchGroup}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [specialties, setSpecialties] = useState([]);

    const [year, setYear] = useState("");

    const searchFilterValue = useRef("");
    const yearFilterValue = useRef(null);
    const specialtyFilterValue = useRef(null);

    function filter(chat) {
        return chat.name.toLowerCase().includes(searchFilterValue.current.toLowerCase()) &&
            (yearFilterValue.current ? chat.group.year === yearFilterValue.current : true) &&
            (specialtyFilterValue.current ? chat.group.specialty._id === specialtyFilterValue.current : true);
    }

    useEffect(() => {
        let ignore = false;

        (async () => {
            const data = await SpecialtiesService.getSpecialties();

            if (!ignore) {
                setSpecialties(data);
            }
        })();

        return () => {
            ignore = true;
        }
    }, []);

    return (
        <div className="filter">
            <div className="filter__search">
                <label htmlFor="groupSearch">Поиск: </label>
                <input
                    id="groupSearch"
                    type="text"
                    placeholder="Введите слово для поиска"
                    onChange={(e) => {
                        searchFilterValue.current = e.target.value;
                        onSearchGroup(() => filter);
                    }}/>
                <input
                    type="button"
                    value="Фильтр"
                    onClick={() => {
                        if (isFilterOpen) {
                            yearFilterValue.current = null;
                            specialtyFilterValue.current = null;
                            setYear("");
                            onSearchGroup(() => filter);
                            setIsFilterOpen(false);
                        } else {
                            setIsFilterOpen(true);
                        }
                    }}/>
            </div>
            {isFilterOpen &&
                <div className="filter__area">
                    <div>
                        <label htmlFor="groupNumber">Курс:&nbsp;</label>
                        <input
                            id="groupNumber"
                            type="number"
                            min="1"
                            value={year}
                            onChange={(e) => {
                                setYear(e.target.value);
                                yearFilterValue.current = Number(e.target.value);
                                onSearchGroup(() => filter);
                            }}/>
                        <button onClick={() => {
                            setYear("");
                            yearFilterValue.current = null;
                            onSearchGroup(() => filter);
                        }}>❌
                        </button>
                    </div>
                    <div>
                        <label>Специальность:&nbsp;</label>
                        <select onChange={(e) => {
                            specialtyFilterValue.current = e.target.value || null;
                            onSearchGroup(() => filter);
                        }}>
                            <option value="">==Не фильтровать==</option>
                            {specialties.map(specialty =>
                                <option key={specialty._id} value={specialty._id}>{specialty.name}</option>
                            )}
                        </select>
                    </div>
                </div>
            }
        </div>
    );
};

export default ChatsFilter;