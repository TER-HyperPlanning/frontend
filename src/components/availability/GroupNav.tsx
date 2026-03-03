import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import type { DayActions } from '../../interfaces/date';

const pageSize: number = 2

interface GroupNavProps {
    selectedGroupNumber: number,
    groups: number[],
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    setGroups: React.Dispatch<React.SetStateAction<number[]>>
    setSelectedGroupNumber: React.Dispatch<React.SetStateAction<number>>
    className?: string
    dispatchSelectedDays: React.ActionDispatch<[action: DayActions]>
}
export const GroupNav = ({ selectedGroupNumber, groups, currentPage, setCurrentPage, setGroups, setSelectedGroupNumber, className, dispatchSelectedDays }: GroupNavProps) => {
    const startIndex = currentPage * pageSize
    const totalPages = Math.ceil(groups.length / pageSize)


    function navLeft() {
        if (currentPage - 1 >= 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    function navRight() {
        if ((currentPage + 1) * pageSize < groups.length) {
            setCurrentPage(currentPage + 1)
        }
    }

    const slicedGroups= useMemo(() => groups.slice(startIndex, startIndex + pageSize), [currentPage, groups])
    return (
        <div className={className}>
            <div className="flex flex-col gap-4">
                <div className='flex items-center gap-4 relative'>
                    <ArrowLeft onClick={() => { navLeft() }}></ArrowLeft>

                    {/* slice groups to display only max two element */}
                    {slicedGroups.map((groupNumber, index) => {
                        const isSelected = groupNumber === selectedGroupNumber;
                        const styleSelected = "btn btn-primary rounded-2xl relative pr-12"
                        const styleNotSelected = "btn rounded-2xl relative pr-12"
                        return (
                            <div
                                className={isSelected ? styleSelected : styleNotSelected}
                                key={groupNumber}
                                onClick={() => { 
                                    dispatchSelectedDays({ type: "resetEditableOnly", groupNumber: selectedGroupNumber })
                                    setSelectedGroupNumber(groupNumber) }}
                            >
                                <span>Groupe {groupNumber}</span>
                                {/* Cross to remove Group */}
                                {groups.length > 1 && <div
                                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white/50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setGroups((prev) => prev.filter((group) => group !== groupNumber))
                                        dispatchSelectedDays({ type: "resetGroup", groupNumber: groupNumber })

                                        // if an element is selected and there is an element before it, select it
                                        if (groups[startIndex + index -1 ] && selectedGroupNumber === groupNumber) {
                                            setSelectedGroupNumber((prev) => prev - 1)
                                        // if an element is selected and there is no element before it, select the next group    
                                        } else if (groups[startIndex + index -1 ] === undefined && selectedGroupNumber === groupNumber){
                                            setSelectedGroupNumber((prev) => prev + 1)
                                        }

                                        // back to previous page if the current page is empty
                                        if (slicedGroups[index-1]===undefined && slicedGroups[index+1]===undefined) {
                                            setCurrentPage((prev) => prev - 1)
                                        }
                                    }}
                                >
                                    ✕
                                </div>}
                            </div>
                        )
                    })
                    }
                    <ArrowRight className='' onClick={() => { navRight() }}></ArrowRight>

                </div>
                <div className='self-center'>page {currentPage + 1} / {totalPages}</div>
                <button className='btn btn-primary'
                    onClick={() => { setGroups((prev) => [...prev, Math.max(...groups) + 1]) }} >
                    Ajouter un groupe
                </button>
            </div>

        </div>
    )
}
