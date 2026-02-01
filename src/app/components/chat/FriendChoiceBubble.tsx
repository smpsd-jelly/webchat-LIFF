"use client";

export default function FriendChoiceBubble({
  isFriend,
  friendChecked,
  onChooseAdd,
  onChooseSkip,
  onOpenAddFriend,
  onRecheckFriendship,
}: {
  isFriend: boolean;
  friendChecked: boolean;
  onChooseAdd: () => void;
  onChooseSkip: () => void;
  onOpenAddFriend: () => void;
  onRecheckFriendship: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
        <div className="text-sm font-semibold text-slate-900">
          ต้องการเพิ่มเพื่อน LINE OA ไหม?
        </div>
        <div className="mt-1 text-xs text-slate-600">
          ไม่จำเป็นต้องเพิ่มเพื่อนก็สามารถส่งข้อความได้
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          * หากเพิ่มเพื่อนจะได้รับข่าวสารอื่น ๆ จากเราเพิ่มเติม
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onChooseAdd}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={onChooseSkip}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            No
          </button>
        </div>

        {/* <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onRecheckFriendship}
            className="text-[12px] font-semibold text-sky-700 hover:underline"
          >
            ตรวจสอบสถานะเพิ่มเพื่อนอีกครั้ง
          </button>

          <button
            type="button"
            onClick={onOpenAddFriend}
            className="text-[12px] font-semibold text-emerald-700 hover:underline"
          >
            เปิดลิงก์เพิ่มเพื่อน
          </button>
        </div>

        {friendChecked && (
          <div className="mt-2 text-[11px] text-slate-400">
            สถานะปัจจุบัน: {isFriend ? "เพิ่มเพื่อนแล้ว" : "ยังไม่ได้เพิ่มเพื่อน"}
          </div>
        )} */}
      </div>
    </div>
  );
}
