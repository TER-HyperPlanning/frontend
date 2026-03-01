import { ArrowLeft, ArrowRight } from 'lucide-react';

const pageSize = 2

interface GroupNavProps {
    selectedGroupNumber: number,
    groups: number[],
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    setGroups: React.Dispatch<React.SetStateAction<number[]>>
    setSelectedGroupNumber: React.Dispatch<React.SetStateAction<number>>
    className?:string
}
export const GroupNav = ({ selectedGroupNumber, groups, currentPage, setCurrentPage, setGroups, setSelectedGroupNumber,className }: GroupNavProps) => {
    const startIndex = currentPage * pageSize


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



    //[0,1] [2;3] [4] page 2 groupe 5 current page 2
    return (
        <div className={className}>
            <div className="flex flex-col gap-4">
                <div className='flex items-center gap-4 relative'>
                    <ArrowLeft onClick={() => { navLeft() }}></ArrowLeft>
                    {groups.slice(startIndex, startIndex + pageSize).map((groupNumber) => {
                        const isSelected = groupNumber === selectedGroupNumber;
                        const styleSelected = "btn btn-primary rounded-2xl relative pr-12"
                        const styleNotSelected = "btn rounded-2xl relative pr-12"
                        return (
                            <div
                                className={isSelected ? styleSelected : styleNotSelected} // On ajoute du padding à droite pour la croix
                                key={groupNumber}
                                onClick={() => { setSelectedGroupNumber(groupNumber) }}
                            >
                                <span>Groupe {groupNumber}</span>
                                {/* Cross de remove Group */}
                                <div
                                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white/50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setGroups((prev) => prev.filter((group) => group !== groupNumber))
                                    }}
                                >
                                    ✕
                                </div>
                            </div>
                        )
                    })
                    }
                    <ArrowRight className='' onClick={() => { navRight() }}></ArrowRight>
                
                </div>
                 <button className='btn btn-primary'
                      onClick={() => { setGroups((prev) => [...prev, Math.max(...groups) + 1]) }} >
                      Ajouter un groupe</button>
            </div>
           
        </div>
    )
}
