import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import InfiniteScroll from 'react-infinite-scroll-component';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

import VariableModal from '@components/Modals/VariableModal';
import { VariableType } from '@enums/DocumentEnum';
import VariableActions from '@components/TableExtensions/VariableActions';
import { IVariable } from '@interfaces/IVariable';
import { findAll, update, remove } from '@api/variables';
import { findAll as findAllCategories } from '@api/categories';

import { HttpStatus } from '@enums/HttpStatusEnum';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { departments } from '@lib/data';
import { showError, showSuccess } from '@lib/ToastMessages';
import { Badge } from 'primereact/badge';
import { CutText } from '@lib/CutText';
import { types } from '@lib/Types';
import useDebounce from '@hooks/debounceHook';
import { ICategoryResponse } from '@interfaces/ICategory';

export default function VariableList() {
    const toast = useRef(null);
    const params = useParams();
    const [categories, setCategories] = useState<ICategoryResponse>();
    const [category, setCategory] = useState<any>();
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 800);
    const [variables, setVariables] = useState<Array<IVariable>>([]);
    const [page, setPage] = useState<number>(1);
    const [municipalities, setMunicipalities] = useState<Array<string>>();
    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        getData();
        const newArray = [];
        departments.map((d) => {
            d.cities.map((c) => {
                newArray.push({
                    value: c,
                    label: `${c} - ${d.department}`
                });
            });
        });
        setMunicipalities(newArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getData();
    }, [category, debouncedSearchParam]);

    useEffect(() => {
        getDataCategories();
    }, []);

    const getDataCategories = async (page: number = 1, size: number = 999) => {
        const res = await findAllCategories({ page, size });
        setCategories(res);
    };

    const getData = async (page: number = 1, size: number = 20, scroll: boolean = false) => {
        const paramsApi = { page, size, documentId: params.id };

        if (searchParam) paramsApi['searchParam'] = searchParam;
        if (category) paramsApi['categoryId'] = category;

        const res = await findAll(paramsApi);

        if (scroll) {
            setVariables((prevArray) => {
                const newArray = prevArray.concat(res.data);
                return newArray;
            });
        } else {
            setVariables(res.data);
        }
    };

    const addVariable = (v: IVariable) => {
        setVariables((prevArray) => {
            const newArray = [{ ...v }].concat(prevArray);
            return newArray;
        });
    };

    const fetchMoreData = () => {
        const newPage = page + 1;
        getData(newPage, 20, true);
        setPage(newPage);
    };

    const variableValue = (variable) => {
        switch (variable?.type) {
            case VariableType.TEXT:
                return <InputText value={variable?.value} onChange={(e) => handleInputChange(variable?._id, e.target.value, 'value')} id="value" className="w-15rem" type="text" placeholder="Valor de la variable" />;

            case VariableType.NUMBER:
                return <InputNumber value={variable?.value} onValueChange={(e) => handleInputChange(variable?._id, e.target.value, 'value')} id="number" className="w-15rem" placeholder="Valor de la variable" useGrouping={false} />;

            case VariableType.DATE:
                return <Calendar value={new Date(variable?.value)} onChange={(e) => handleInputChange(variable?._id, e.target.value, 'value')} id="date" className="w-15rem" placeholder="Valor de la variable" />;

            case VariableType.MUNICIPALITIES:
                return (
                    <Dropdown
                        filter
                        value={variable?.value}
                        onChange={(e) => handleInputChange(variable?._id, e.target.value, 'value')}
                        options={municipalities}
                        optionLabel="label"
                        optionValue="value"
                        id="municipalities"
                        placeholder="Categoría de la variable"
                        className="w-15rem"
                    />
                );

            default:
                return <InputText value={variable?.value} onChange={(e) => handleInputChange(variable?._id, e.target.value, 'value')} id="value" type="text" className="w-15rem" placeholder="Valor de la variable" />;
        }
    };

    const typeValue = (variable) => {
        return (
            <div>
                <Dropdown value={variable?.type} optionLabel="name" optionValue="value" onChange={(e) => handleInputChange(variable?._id, e.target.value, 'type')} options={types} id="type" placeholder="Tipo de la variable" className="w-15rem" />
            </div>
        );
    };

    const handleInputChange = (id: string, value: string | number, key: string) => {
        const modifiedVariables = variables.map((v: IVariable) => {
            if (v._id === id) {
                v[key] = value;
                if (key === 'type') {
                    v['value'] = '';
                }
            }
            return v;
        });

        setVariables(modifiedVariables);
    };

    // Table actions
    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleDelete = async (id: string) => {
        const res = await remove(id);
        if (res.status === HttpStatus.OK) {
            const modifiedVariables = variables.filter((v) => v._id !== id);
            setVariables(modifiedVariables);
            showSuccess(toast, '', 'Variable eliminada');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleEdit = async (data: IVariable) => {
        const res = await update(data._id, {
            value: data.value,
            type: data.type
        });

        if (res.status === HttpStatus.OK) {
            showSuccess(toast, '', 'Variable actualizada');
            //getData();
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    return (
        <InfiniteScroll dataLength={variables.length} next={fetchMoreData} hasMore={true} loader={''}>
            <section>
                <Toast ref={toast} />
                <div className="w-full sm:flex justify-content-between mb-3">
                    <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" label="Variable" />

                    <div className="mt-3 sm:mt-0 sm:flex align-items-center">
                        <Dropdown value={category} showClear onChange={(e) => setCategory(e.value)} options={categories?.data} id="category" optionLabel="name" optionValue="_id" placeholder="Categoría de la variable" className="w-15rem mr-4" />
                        <InputText value={searchParam} className="sm:w-20rem" onChange={(e) => setSearchParam(e.target.value)} id="searchParm" type="text" placeholder="Buscar" />
                    </div>
                </div>

                {openModal ? <VariableModal state={openModal} toast={toast} setState={(e) => setOpenModal(e)} addData={(v) => addVariable(v)} /> : ''}

                <DataTable value={variables} emptyMessage=" ">
                    <Column field="_id" header="ID" body={(rowData: IVariable) => <Badge onClick={() => handleCopy(rowData?._id)} className="cursor-pointer text-lg" value={`${rowData?._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="name" header="Nombre" body={(rowData) => `${CutText(rowData?.name)}`}></Column>
                    <Column field="value" header="Valor" body={variableValue}></Column>
                    <Column field="category.name" header="Categoría" body={(rowData) => <Badge value={rowData?.category.name} severity="danger"></Badge>}></Column>
                    <Column field="type" header="Tipo" body={typeValue}></Column>
                    <Column field="actions" header="Acciones" body={(rowData: IVariable) => <VariableActions handleEdit={() => handleEdit(rowData)} handleDelete={() => handleDelete(rowData?._id)} />}></Column>
                </DataTable>
            </section>
        </InfiniteScroll>
    );
}
