import React from "react";
import {
  useGetDeletedItemMutation,
  useGetNormalItemListsQuery,
  useGetUsersQuery,
  useLoginMutation,
} from "../../features/api/fakeStoreApi";
import TableGroup from "../../components/reuseableComponent/TableGroup";
import TestTwo from "../../components/test/TestTwo";
import { useDispatch } from "react-redux";
import { addUser } from "../../features/service/authSlice";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

const TablePageThree = () => {
  const { data } = useGetNormalItemListsQuery();
  const { data: userData } = useGetUsersQuery();
  const currentItems = data;
  const totalSum = Number(
    currentItems?.reduce((sum, item) => sum + item.price, 0).toFixed(3)
  );

  const { register, handleSubmit } = useForm({
    username: "",
    password: "",
  });
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const loginHandler = async (user) => {
    const { data } = await login(user);
    dispatch(addUser({ token: data?.token }));
    console.log(data);
  };

  // console.log(data);
  // console.log(userData);

  const caption = [
    {
      key: "manager",
      value: {
        fontSize: 25,
        fontWeight: "bold",
        captionVariant: "text-red-500",
      },
    },
    {
      key: "data",
      value: "Item Table",
    },
  ];

  const columns = [
    {
      key: "manager",
      value: [
        {
          id: "columnsVariant",
          dataColor: "bg-yellow-100",
          dataVariant:
            " px-3 py-1 text-left text-sm font-medium text-yellow-900 border-yellow-300 rounded-xl",
          dataPosition: "item-center justify-center gap-1",
        },
        {
          id: "headerCell",
          coordination: { x: [7, 8], y: 0 },
          dataVariant: "border-r-0 text-red-500 bg-red-900 text-xl font-bold",
          dataPosition: "items-start justify-end",
        },
        {
          id: "headerCell",
          coordination: { x: [6, 7], y: 1 },
          dataVariant: "border-r-0 text-blue-500 bg-blue-900 text-xs font-thin",
          dataPosition: "items-end justify-start",
        },
        {
          id: "headerCell",
          coordination: { x: 4, y: [0, 1] },
          dataVariant: "border-b-0 text-white bg-black text-xl",
          dataPosition: "items-start justify-start",
        },
      ],
    },
    {
      key: "data",
      value: [
        [
          { header: true, key: "checkBox", action: "checkMarks" },
          { header: "ID", key: "id" },
          { header: "Name", key: "title" },
          { header: "Image", key: "image", action: "photos" },
          { header: "Price", key: "price" },
          { header: "Description", key: "description", icon: "📝" },
          { header: "Category", key: "category" },
          { header: "Rating", key: "rating.rate" },
          { header: "Rating", key: "rating.count" },
          { header: "Button", key: "button", action: "actions", icon: "📝" },
        ],
        [
          { header: "Rate", key: "rating.rate" },
          { header: "Count", key: "rating.count" },
        ],
      ],
    },
  ];

  const bodyData = [
    {
      key: "manager",
      value: [
        {
          id: "bodyVariant",
          dataColor: "bg-yellow-100",
          dataVariant:
            "px-2 py-2 text-left text-sm font-medium text-yellow-900 border-yellow-300 rounded-xl",
          dataPosition: "item-center justify-center",
        },
        {
          id: "bodyCell",
          coordination: { x: [7, 8], y: 0 },
          dataVariant: "border-r-0 text-red-500 bg-red-900 text-xl font-bold",
          dataPosition: "items-start justify-end",
        },
        {
          id: "bodyCell",
          coordination: { x: [1, 2, 5], y: 2 },
          dataVariant: "border-b-0 text-blue-500 bg-blue-900 text-xs font-thin",
          dataPosition: "items-end justify-start",
        },
        {
          id: "bodyCell",
          coordination: { x: 4, y: [1, 3] },
          dataVariant: "border-r-0 text-white bg-black text-xl",
          dataPosition: "items-start justify-start",
        },
        {
          id: "bodyCell",
          coordination: { x: 0, y: [0, 1, { from: 2, to: 19 }] },
          dataVariant: "border-r-0 border-b-0",
          dataPosition: "items-start justify-start",
        },
      ],
    },
    {
      key: "data",
      value: {
        data: currentItems,
        dataLength: currentItems?.length,
        eradicateMutation: useGetDeletedItemMutation,
        // imitateMutation: "",
        // abductMutation: "",
        // editMutation: "",
        authorizer: Cookies.get("token"),
        // cookies: "token",
        param: "စားပြီးပြီလား",
      },
    },
  ];

  const footers = [
    {
      key: "manager",
      value: [
        {
          id: "footerVariant",
          dataColor: "bg-gray-100",
          dataVariant:
            " px-2 py-2 text-sm font-medium text-gray-900 border-gray-300 rounded-xl",
          dataPosition: "item-center justify-end",
        },
        {
          id: "footerCell",
          coordination: { x: [0, 1], y: [6, 7] },
          dataVariant: "border-r-0 text-white bg-gray-500 text-xl",
          dataPosition: "items-start justify-start",
        },
        {
          id: "footerCell",
          coordination: { x: 4, y: 6 },
          dataVariant: "border-r-0 border-b-0 text-white bg-cyan-500 text-xl",
          dataPosition: "items-start justify-start",
        },
        {
          id: "footerCell",
          coordination: { x: 5, y: 7 },
          dataVariant: "border-r-0 text-white bg-amber-500 text-xl",
          dataPosition: "items-start justify-start",
        },
      ],
    },
    {
      key: "data",
      value: [
        [
          { footer: "Total Price for limited sum", col: 0 },
          { footer: true, sumLimit: 2, toSum: "price", col: 3 },
        ],
        [
          { footer: "Total Price for only chosen", col: 0 },
          { footer: true, sumOnly: [0, 1, 2, 9], toSum: "price", col: 3 },
        ],
        [
          {
            footer: "Total Price for only selected",
            col: 0,
            key: "uniqueIdCheckbox",
          },
          {
            footer: true,
            sumChecked: "uniqueIdCheckbox",
            toSum: "price",
            col: 3,
          },
        ],
        [
          { footer: "Total Price for this Page", col: 0 },
          { footer: true, toSum: "price", col: 3 },
        ],
        [
          { footer: "Total Price for all Items", col: 0 },
          { footer: totalSum?.toLocaleString(), col: 4 },
        ],
        [
          { footer: "Total Item Count", col: 0 },
          { footer: currentItems?.length, col: 5 },
        ],
        [
          { footer: "စမ်းကြည့်တာ။", col: 0 },
          { footer: "အောင်မြင်တယ်ကွ။", col: 4 },
        ],
        [
          { footer: "ကျေနပ်လား။", col: 2 },
          { footer: "မကျေနပ်လဲ မတတ်နိုင်ဘူး။", col: 5 },
        ],
      ],
    },
  ];

  const action = [
    {
      photos: [
        {
          key: "manager",
          value: [
            {
              id: "photosVariant",
              dataSize: { x: 50 },
              dataFit: "contain",
              dataRadius: 5,
              dataRatio: 1 / 1,
            },
          ],
        },
      ],
    },
    {
      actions: [
        {
          key: "manager",
          value: [
            {
              id: "actionsVariant",
              actionsFlexType: "vertical",
              verticalColumns: 3,
              actionsBetween: 8,
              // dataPosition: "items-center justify-center",
            },
          ],
        },
        {
          key: "data",
          value: [
            {
              label: "Detail",
              onClick: (navigator, row) =>
                navigator(`/cms-admin/tablePageDetail/${row.id}`),
              icon: "👁",
              iconFlexType: "vertical",
              gapBetween: 4,
              iconVariant: "text-gray-500",
              dataVariant: "text-yellow-500 hover:text-yellow-700",
            },
            {
              label: "Delete",
              onClick: (eradicator, row) => eradicator(row?.id),
              icon: "✂",
              gapBetween: 4,
              iconVariant: "text-yellow-500",
              dataVariant: "text-yellow-500 hover:text-yellow-700",
            },
            {
              label: "Favorite",
              onClick: (abductor, row) => abductor(row),
              icon: "❤︎",
              gapBetween: 4,
              iconVariant: "text-red-500",
              dataVariant: "text-yellow-500 hover:text-yellow-700",
            },
            {
              label: "Copy",
              onClick: (imitator, row) => imitator(row),
              icon: "🗐",
              gapBetween: 4,
              iconVariant: "text-green-500",
              dataVariant: "text-yellow-500 hover:text-yellow-700",
              colSpan: 2,
            },
            {
              label: "Edit",
              onClick: (editor, row) => editor(row),
              icon: "✎",
              gapBetween: 4,
              iconVariant: "text-yellow-500",
              dataVariant: "text-yellow-500 hover:text-yellow-700",
              colStart: 3,
            },
          ],
        },
      ],
    },
  ];

  const themeManager = [
    {
      key: "layoutVariant",
      value: [
        {
          id: "caption",
          captionSide: "top",
          dataPosition: "text-end",
          gapBelow: 20,
        },
        {
          id: "table",
          dataRadius: { tl: 18, tr: 18, bl: 18, br: 18 },
          dataSpacing: { x: 8, y: 8 },
        },
        {
          id: "pagination",
          dataPosition: "justify-center md:justify-end",
          gapAbove: 20,
          gapBetween: 18,
          reverse: { X: false, Y: true },
        },
      ],
    },
    {
      key: "paginationVariant",
      value: [
        {
          id: "colorVariant",
          dropdownVariant: "bg-white",
          hoverVariant: "hover:bg-yellow-100",
          colorVariant: "text-yellow-900 border-yellow-500",
          activeVariant: "bg-yellow-500 text-white",
        },
      ],
    },
  ];

  const paginationEngines = {
    pagination: "frontendMode",
    searchPage: true,
    perPage: true,
    // sorting: true,
    // filter: true,
    // searchbar: true,
  };

  const merges = [
    { key: "manager", value: [] },
    {
      key: "data",
      value: [
        { type: "header", startCol: 0, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 1, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 2, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 3, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 4, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 5, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 6, colSpan: 1, rowSpan: 2 },
        { type: "header", startCol: 7, colSpan: 2, rowSpan: 1 },
        { type: "header", startCol: 9, colSpan: 1, rowSpan: 2 },
        // { type: "body", startRow: 1, startCol: 1, colSpan: 1, rowSpan: 1 },
        // { type: "body", startRow: 1, startCol: 1, colSpan: 1, rowSpan: 1 },
        // {
        //   type: "body",
        //   startRow: 0,
        //   startCol: 5,
        //   colSpan: 2,
        //   showData: [5, 6],
        //   separator: "|",
        //   applyToAllRows: true,
        // },
        { type: "footer", startCol: 0, colSpan: 3, rowSpan: 1 },
        { type: "footer", startCol: 3, colSpan: 7, rowSpan: 1 },
        { type: "footer", startRow: 1, startCol: 0, colSpan: 3, rowSpan: 1 },
        { type: "footer", startRow: 1, startCol: 3, colSpan: 7, rowSpan: 1 },
        { type: "footer", startRow: 2, startCol: 0, colSpan: 3, rowSpan: 1 },
        { type: "footer", startRow: 2, startCol: 3, colSpan: 7, rowSpan: 1 },
        { type: "footer", startRow: 3, startCol: 0, colSpan: 3, rowSpan: 1 },
        { type: "footer", startRow: 3, startCol: 3, colSpan: 7, rowSpan: 1 },
        { type: "footer", startRow: 4, startCol: 0, colSpan: 4, rowSpan: 1 },
        { type: "footer", startRow: 4, startCol: 4, colSpan: 6, rowSpan: 1 },
        { type: "footer", startRow: 5, startCol: 0, colSpan: 5, rowSpan: 1 },
        { type: "footer", startRow: 5, startCol: 5, colSpan: 5, rowSpan: 1 },
        { type: "footer", startRow: 7, startCol: 3, colSpan: 2, rowSpan: 1 },
      ],
    },
  ];

  const access = [
    { key: "role", value: "admin" },
    {
      key: "permission",
      value: {
        admin: { viewColumns: "all", allowActions: true, allowCheckbox: true },
        sales: {
          viewColumns: "all",
          allowActions: ["Detail"],
          allowCheckbox: true,
        },
        viewOnly: {
          viewColumns: "all",
          allowActions: false,
          allowCheckbox: false,
        },
        customer: {
          viewColumns: ["id", "title", "price"],
          allowActions: false,
          allowCheckbox: false,
        },
      },
    },
  ];

  const tableData = [
    { key: "caption", value: caption },
    { key: "themeManager", value: themeManager },
    { key: "columns", value: columns },
    { key: "action", value: action },
    { key: "footers", value: footers },
    { key: "data", value: bodyData },
    { key: "perPage", value: currentItems?.length },
    { key: "merges", value: merges },
    { key: "access", value: access },
  ];

  return (
    <div className=" flex flex-col w-full h-full gap-5">
      <TestTwo />
      <form
        onSubmit={handleSubmit(loginHandler)}
        className=" flex flex-col gap-2.5 items-center justify-center"
      >
        <input
          className="bg-cyan-500 px-3 py-1.5 rounded-2xl"
          {...register("username")}
          type="text"
          value="johnd"
        />
        <input
          className="bg-cyan-500 px-3 py-1.5 rounded-2xl"
          {...register("password")}
          type="text"
          value="m38rmF$"
        />
        <span className=" flex flex-row items-center justify-center gap-2.5">
          <button className="bg-cyan-500 px-3 py-1.5 rounded-2xl" type="submit">
            Login
          </button>
          <button className="bg-red-500 px-3 py-1.5 rounded-2xl" disabled>
            Logout
          </button>
        </span>
      </form>
      <TableGroup data={tableData} paginationCore={paginationEngines} />
    </div>
  );
};

export default TablePageThree;
