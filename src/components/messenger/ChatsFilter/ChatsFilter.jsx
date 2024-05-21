import React, {useEffect, useRef, useState} from 'react';
import "./ChatsFilter.css";
import SpecialtiesService from "../../../services/SpecialtiesService";
import ImageButton from "../../ui/ImageButton/ImageButton";
import TextInput from "../../ui/TextInput/TextInput";
import NumberInput from "../../ui/NumberInput/NumberInput";
import BetterSelect from "../../ui/BetterSelect/BetterSelect";

const ChatsFilter = ({onSearchGroup}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false  );
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
            <div className="filter__search-box">
                <TextInput
                    className="filter__input"
                    icon={"static/images/search.png"}
                    placeholder="Введите слово для поиска"
                    onChange={(value) => {
                        searchFilterValue.current = value;
                        onSearchGroup(() => filter);
                    }}
                    onClearText={() => {
                        searchFilterValue.current = "";
                    }}/>
                <ImageButton
                    className="filter__button"
                    src="static/images/filter.png"
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
                    <div className="filter__clause">
                        <p>Курс:&nbsp;</p>
                        <NumberInput
                            id="groupNumber"
                            min={1}
                            value={year}
                            onChange={(value) => {
                                setYear(value);
                                yearFilterValue.current = Number(value);
                                onSearchGroup(() => filter);
                            }}/>
                    </div>
                    <div className="filter__clause">
                        <p>Специальность:&nbsp;</p>
                        <BetterSelect
                            className="filter__better-select"
                            onChange={(value) => {
                                console.log(value)
                                specialtyFilterValue.current = value;
                                onSearchGroup(() => filter);
                            }}
                            defaultElement={{value: null, text: "Не фильтровать"}}
                            elements={specialties.map(specialty =>
                                ({value: specialty._id, text: specialty.name})
                            )}>
                        </BetterSelect>
                    </div>
                </div>
            }
        </div>
    );
};

export default ChatsFilter;