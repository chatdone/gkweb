import { Button, Radio } from '@arco-design/web-react';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';

import TemplateDetail, { FormValues } from './TemplateDetail';

import { ProjectTemplate } from 'generated/graphql-types';

type Props = {
  templates: (ProjectTemplate | null)[] | null | undefined;
  selectedTemplateId: string | undefined;
  loading: boolean;
  onCreate: (values: FormValues) => void;
  onUpdate: (template: ProjectTemplate | null, values: FormValues) => void;
  onChangeTemplate: (templateId: string) => void;
  onCancel: () => void;
  onDeleteTemplate: (
    template: ProjectTemplate | null,
    callback: () => void,
  ) => void;
};

const TemplateList = (props: Props) => {
  const {
    templates,
    selectedTemplateId,
    loading,
    onCreate,
    onUpdate,
    onChangeTemplate,
    onCancel,
    onDeleteTemplate,
  } = props;

  const [showTemplateDetail, setShowTemplateDetail] = useState<boolean>(false);
  const [viewTemplate, setViewTemplate] = useState<ProjectTemplate | null>();

  const handleCreateTemplate = () => {
    setShowTemplateDetail(true);
  };

  const handleViewTemplate = (template: ProjectTemplate | null) => {
    setViewTemplate(template);
    setShowTemplateDetail(true);
  };

  const handleCancelViewTemplate = () => {
    setViewTemplate(undefined);
    setShowTemplateDetail(false);
  };

  const handleChangeTemplate = (templateId: string) => {
    onChangeTemplate(templateId);
  };

  return (
    <div className="mt-2 rounded bg-gray-100">
      {showTemplateDetail ? (
        <TemplateDetail
          loading={loading}
          template={viewTemplate}
          onCreate={onCreate}
          onUpdate={(values) => viewTemplate && onUpdate(viewTemplate, values)}
          onCancel={handleCancelViewTemplate}
          onDelete={() =>
            viewTemplate &&
            onDeleteTemplate(viewTemplate, handleCancelViewTemplate)
          }
        />
      ) : (
        <List
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          onCreate={handleCreateTemplate}
          onView={handleViewTemplate}
          onConfirm={handleChangeTemplate}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

const List = ({
  templates,
  selectedTemplateId: propTemplateId,
  onCreate,
  onView,
  onConfirm,
  onCancel,
}: {
  templates: (ProjectTemplate | null)[] | null | undefined;
  selectedTemplateId: string | undefined;
  onCreate: () => void;
  onView: (template: ProjectTemplate | null) => void;
  onConfirm: (templateId: string) => void;
  onCancel: () => void;
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >(propTemplateId);

  const handleConfirm = () => {
    selectedTemplateId && onConfirm(selectedTemplateId);
  };

  return (
    <div>
      <div className="px-3 py-4">
        <Radio.Group
          className="grid grid-cols-2 gap-y-4 md:grid-cols-3"
          value={selectedTemplateId}
          onChange={(value) => setSelectedTemplateId(value)}
        >
          {templates?.map((template) => (
            <Radio key={template?.id} value={template?.id}>
              {({ checked }) => {
                return (
                  <div
                    className={`h-40 rounded border bg-white p-2 ${
                      checked ? 'border-red-600' : 'border-gray-300'
                    }`}
                  >
                    <div className="h-16 font-bold">{template?.name}</div>

                    <div className="text-gray-600">
                      <div>
                        {Object.keys(template?.columns).length || 0} Properties
                      </div>
                      <div>{template?.statuses?.length} Status</div>
                    </div>

                    <div
                      className="z-50 mt-2 text-brand-600 hover:text-brand-400"
                      onClick={() => onView(template)}
                    >
                      View/edit
                    </div>
                  </div>
                );
              }}
            </Radio>
          ))}

          <div
            className="mr-5 rounded border-2 border-dashed border-gray-300 py-10 text-center hover:border-gray-900"
            onClick={onCreate}
          >
            <MdAdd className="mb-2 text-3xl text-gray-400" />
            <div>Add template</div>
          </div>
        </Radio.Group>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 p-3 text-center">
        <Button className="mr-2" size="small" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="primary" size="small" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default TemplateList;
