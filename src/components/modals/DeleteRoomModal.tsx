import { HiOutlineExclamation, HiOutlineTrash } from 'react-icons/hi';
import type { Room } from "@/hooks/api/rooms";
import Button from '@/components/Button';
import { useDeleteRoom } from "@/hooks/rooms/useDeleteRoom";


interface DeleteRoomModalProps {
    isOpen: boolean;
    room: Room | null;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError?: (message: string) => void;
}

export default function DeleteRoomModal({
    isOpen,
    room,
    onClose,
    onSuccess,
    onError
}: DeleteRoomModalProps) {

    const { mutate: deleteRoom, isPending } = useDeleteRoom();

    if (!isOpen || !room) return null;

    const handleDelete = () => {
        deleteRoom(room.roomId, {
            onSuccess: () => {
                onSuccess(`La salle ${room.roomNumber} a été supprimée avec succès.`);
                onClose();
            },
            onError: (error: any) => {
                console.log("DELETE ERROR:", error);

                const backendMessage =
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message;

                let message = "Impossible de supprimer la salle";

                if (backendMessage) {
                    const msg = backendMessage.toLowerCase();

                    if (
                        msg.includes("session") ||
                        msg.includes("linked") ||
                        msg.includes("constraint") ||
                        msg.includes("foreign")
                    ) {
                        message = "Impossible : la salle est liée à une séance";
                    } else {
                        message = backendMessage;
                    }
                }
                onClose();

                onError?.(message);

            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100">

                <div className="flex flex-col items-center text-center">

                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                        <HiOutlineExclamation size={40} />
                    </div>

                    <h3 className="text-2xl font-bold text-[#003366] mb-2">
                        Supprimer la salle
                    </h3>

                    <p className="text-gray-500 mb-8">
                        Êtes-vous sûr de vouloir supprimer{" "}
                        <span className="font-bold text-gray-700">
                            {room.roomNumber}
                        </span> ?
                        Cette action est irréversible.
                    </p>

                    <div className="flex gap-4 w-full">

                        <button
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                            Annuler
                        </button>

                        <Button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-red-200"
                        >
                            {isPending ? (
                                "Suppression..."
                            ) : (
                                <>
                                    <HiOutlineTrash size={20} />
                                    <span>Supprimer</span>
                                </>
                            )}
                        </Button>

                    </div>

                </div>
            </div>
        </div>
    );
}