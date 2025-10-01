import Modal from '../../layout/Modal'

const Warning = ({ open, onClose, onConfirm }) => {

  return open && (
    <Modal>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center flex flex-col gap-10"
      >
        <div >
          {/* عنوان */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            آیا مطمئن هستید؟
          </h2>

          {/* متن */}
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            با انجام این کار دیگر قادر به بازگشت نخواهید بود.
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-between  gap-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 
                           text-gray-700 dark:text-gray-300 font-medium 
                           hover:bg-gray-200 dark:hover:bg-gray-800 transition-all cursor-pointer"
          >
            انصراف
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}

            className="w-full py-2.5 rounded-xl bg-red-600 text-white font-medium 
                           hover:bg-red-700 transition-all shadow-lg cursor-pointer"
          >
            بله
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default Warning