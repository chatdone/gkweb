import { Modal, Checkbox, Button, Tabs, Tag } from '@arco-design/web-react';
import { IconCaretDown } from '@arco-design/web-react/icon';
import { head } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import Message from '@/components/Message';

import { QueryProjectTemplateGallery } from '../TaskSubNav';

import { DEFAULT_PROJECT_TEMPLATES_GALLERY } from '@/constants/task.constants';

type Props = {
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
  galleryOptions: QueryProjectTemplateGallery;
  onApplyTemplateGallery: (template: ProjectTemplateGalleryProps) => void;
};

export type ProjectTemplateGalleryProps = {
  name: string;
  title: string;
  groups: {
    name: string;
    tasks: string[];
  }[];
  status: string[];
  fields: string[];
  customFields?: { name: string; type: string }[];
};

const ProjectTemplateGallery = (props: Props) => {
  const { visible, onOpen, onClose, galleryOptions, onApplyTemplateGallery } =
    props;

  const groups = useMemo(() => {
    if (!galleryOptions) {
      // If couldn't get the gallery options from the DB for some reason, we use the hardcoded version instead.
      return DEFAULT_PROJECT_TEMPLATES_GALLERY || [];
    }

    return galleryOptions.galleryTemplates;
  }, [galleryOptions]) as {
    name: string;
    key: string;
    templates: ProjectTemplateGalleryProps[];
  }[];

  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<{
    name: string;
    title: string;
    groups: {
      name: string;
      tasks: string[];
    }[];
    status: string[];
    fields: string[];
  }>(groups[0]?.templates?.[0] as ProjectTemplateGalleryProps);

  const [selectedTemplateTab, setSelectedTemplateTab] = useState(
    head(groups)?.key,
  );
  useEffect(() => {
    if (!visible) {
      setShowPreview(false);
    }

    setSelectedTemplateTab(head(groups)?.key);
  }, [visible, groups]);
  const bgcolor = [
    'bg-orange-100',
    'bg-green-100',
    'bg-cyan-100',
    'bg-blue-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-amber-100',
    'bg-lime-100',
    'bg-sky-100',
    'bg-violet-100',
    'bg-rose-100',
    'bg-yellow-100',
    'bg-emerald-100',
    'bg-indigo-100',
    'bg-fuchsia-100',
    'bg-slate-100',
    'bg-red-100',
    'bg-teal-100',
  ];

  return (
    <>
      <Modal
        title="Project Templates"
        visible={visible}
        okText="Add Project"
        onOk={onOpen}
        onCancel={onClose}
        autoFocus={false}
        focusLock={true}
        escToExit={true}
        className="w-full max-w-3xl"
        footer={null}
      >
        {showPreview ? (
          <div className="-mx-5 -my-6">
            <div className="flex  px-4 py-2 border-b border-gray-200">
              <div className="flex-1">
                <span
                  className="text-brand-500 cursor-pointer"
                  onClick={() => setShowPreview(false)}
                >
                  Back
                </span>
                <div className="font-bold text-lg">{previewTemplate?.name}</div>
              </div>
              <div className="pt-2">
                <Button
                  type="primary"
                  onClick={() => {
                    setShowPreview(false);
                    Message.normal('Applying template...');
                    onApplyTemplateGallery(
                      previewTemplate as ProjectTemplateGalleryProps,
                    );
                  }}
                >
                  Use this template
                </Button>
              </div>
            </div>
            <div className="h-96 overflow-y-auto p-4">
              <div className="font-bold text-2xl font-heading">
                {previewTemplate?.title}
              </div>
              {previewTemplate?.groups?.map((group, index) => (
                <div key={index}>
                  <div className="pt-4 pb-2 font-bold text-base font-heading">
                    <IconCaretDown className="text-gray-500" /> {group.name}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="border-collapse border border-gray-200 w-full whitespace-nowrap table-fixed">
                      <thead>
                        <tr>
                          <th className="w-8 border-y border-gray-200 p-2 bg-gray-50">
                            <Checkbox />
                          </th>
                          <th className="w-40 border-y border-gray-200 p-2 bg-gray-50">
                            Name
                          </th>
                          <th className="w-20 border-y border-gray-200 p-2 bg-gray-50">
                            Status
                          </th>
                          {previewTemplate?.fields?.map((field, index) => (
                            <th
                              key={index}
                              className="w-20 border-y border-gray-200 p-2 bg-gray-50"
                            >
                              {field}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.tasks.map((task, index) => (
                          <tr key={index}>
                            <td className="border-y border-gray-200 p-2">
                              <Checkbox />
                            </td>
                            <td className="border-y border-gray-200 p-2">
                              {task}
                            </td>
                            <td className="border-y border-gray-200 p-2">
                              <Tag
                                color="green"
                                bordered
                                className="w-full text-center"
                              >
                                {previewTemplate?.status?.[0]}
                              </Tag>
                            </td>
                            {previewTemplate?.fields?.map?.((_, index) => (
                              <td
                                key={index}
                                className="border-y border-gray-200 p-2"
                              >
                                &nbsp;
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Tabs
            defaultActiveTab={selectedTemplateTab}
            onClickTab={(val) => setSelectedTemplateTab(val)}
          >
            {groups.map((group, group_index) => (
              <Tabs.TabPane key={group.key} title={group.name}>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {group.templates.map((template, template_index) => (
                    <div
                      key={template_index}
                      className="border border-gray-200 hover:border-gray-600 cursor-pointer"
                      onClick={() => {
                        setShowPreview(true);
                        setPreviewTemplate(
                          groups[group_index]?.templates?.[template_index],
                        );
                      }}
                    >
                      <div className="p-2 font-bold text-lg">
                        {template?.name}
                      </div>
                      <div className={`pt-4 pl-4 ${bgcolor[template_index]}`}>
                        <div className="bg-white border-t-8 border-l border-gray-200 pt-2 pl-4">
                          <div className="overflow-hidden text-2xl font-bold font-heading whitespace-nowrap">
                            {template?.title}
                          </div>
                          <div className="pt-4 pb-2">
                            {template?.groups[0]?.name}
                          </div>
                          <table className="border-collapse border border-gray-200 w-full">
                            <thead>
                              <tr>
                                <th className="w-2/4 border border-gray-200 bg-gray-50">
                                  &nbsp;
                                </th>
                                <th className="w-1/4 border border-gray-200 bg-gray-50">
                                  &nbsp;
                                </th>
                                <th className="w-1/4 border border-gray-200 bg-gray-50">
                                  &nbsp;
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-200">
                                  &nbsp;
                                </td>
                                <td className="border border-gray-200">
                                  &nbsp;
                                </td>
                                <td className="border border-gray-200">
                                  &nbsp;
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </Modal>
    </>
  );
};

export default ProjectTemplateGallery;
