import React, { useState, useEffect } from 'react';
import { Button, Col, Modal, Row, Space } from 'antd';
import { ManagerService } from 'services';
import { IRoleRspModel, IUserRoleReqModel, IEnterpriseUserRspModel, IEnterpriseUserReqModel, IEnterpriseContactModel, isWxBrowser } from 'models';
import { ConfirmModal, Loading, ManagerForm, ManagerTable } from 'components';
import { selectEnterpriseContact } from 'models/WeComConfig';

export const Managers: React.FunctionComponent = () => {
  const [managerModels, setManagerModels] = useState<IEnterpriseUserRspModel[]>();
  const [roleModels, setRoleModels] = useState<IRoleRspModel[]>();

  const [managerModel, setManagerModel] = useState<IEnterpriseUserRspModel>();

  const [showConfigModal, setShowConfigModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  let manager = managerModel!

  const setManager = (props: Partial<IEnterpriseUserRspModel>) => {
    setManagerModel({...manager, ...props });
  }

  const handleEdit = (item : IEnterpriseUserRspModel) => {
    setManagerModel(item)
    setShowConfigModal(true)
    setIsEdit(true)
  }

  const handleCreate = () => {
    selectEnterpriseContact((res: any) => {
      if (res.err_msg === "selectEnterpriseContact:ok")
      {
        if(typeof res.result == 'string')
        {
          res.result = JSON.parse(res.result) as IEnterpriseContactModel
        }
        
        if (res.result.userList.length === 1) {
          const user = res.result.userList[0]
          if(managerModels?.findIndex(c=>c.userId === user.id) === -1) {
            const item : IEnterpriseUserRspModel = {
              userId: user.id,
              name: user.name,
              managementModules: []
            }
      
            setManagerModel(item)
            setShowConfigModal(true)
            setIsEdit(false)
          }
          else {
            ConfirmModal({
              title: `用户 ${res.result.userList[0].name} 已经是管理员`,
            })
          }
        }
        else {
          ConfirmModal({
            title: " 请选择一个企业微信用户",
          })
        }
      }
      else {
        console.log(res.err_msg)
      }
    })    
  }

  const handleSave = (deleteRoles : IRoleRspModel[]) => {
    if(managerModel) {
      if(managerModel?.id) {
        var promiseList : Promise<unknown>[]  = []
        managerModel.managementModules.forEach((module) => {
          const input : IUserRoleReqModel= {
            enterpriseUserId: managerModel.id,
            moduleId: module.id
          }

          promiseList.push(ManagerService.addUserRole(input))
        })

        deleteRoles.forEach((module) => {
          promiseList.push(ManagerService.deleteUserRole(managerModel.id!, module.id))
        })
        
        setShowConfigModal(false)
        setIsLoading(true);
        setLoadingTip("保存管理员...")
        Promise.all(promiseList).then(() => {
          setIsLoading(false);
          refresh()
        })
      }
      else {
        const input : IEnterpriseUserReqModel = {
          ...managerModel,
          managementModules: managerModel.managementModules.map(c=> {return { enterpriseUserId: managerModel.id, moduleId: c.id} as IUserRoleReqModel})
        }

        
        setShowConfigModal(false)  
        setIsLoading(true);
        setLoadingTip("保存管理员...")
        ManagerService.addManager(input).then(() => {
          setIsLoading(false);
          refresh()
        })
      }
    }    
  }

  const handleDelete = () => {
    if(managerModels) {
      if(managerModel?.id) {        
        setShowConfigModal(false)
        setIsLoading(true);
        setLoadingTip("删除管理员...")
        ManagerService.deleteManager(managerModel?.id).then(() => {
          setIsLoading(false);
          refresh()
        })
      }
    }
  }

  const loadingRoles = () => {
    setIsLoading(true);
    setLoadingTip("加载权限...")
    ManagerService.getRoles().then(rsp => {
      if(rsp && rsp instanceof Array) {
        setRoleModels(rsp)
      }

      setIsLoading(false);
    })
  }

  const refresh = () => {
    setIsLoading(true);
    setLoadingTip("加载管理员...")
    ManagerService.getManagers().then(rsp => {
      if(rsp && rsp instanceof Array) {
        setManagerModels([...rsp]);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    refresh()
    loadingRoles()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />     
      <Row style={{marginTop: 10}}>
        <Col offset={1} span={22}>
          <Row style={{marginBottom: 10}}>
            <Col span={24}>
              <Space style={{float: 'right'}}>
                <Button hidden={!isWxBrowser()} type="primary" onClick={handleCreate} >新建</Button>
              </Space>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ManagerTable 
                handleSelect={handleEdit} 
                currentManagers={managerModels} 
                loading={false} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal 
        title="管理员配置" 
        visible={showConfigModal}
        centered={true}
        destroyOnClose={true} 
        footer={null} 
        onCancel={()=>setShowConfigModal(false)}
      >
        <ManagerForm 
          currentManager={managerModel} 
          allRoles={roleModels} 
          isEdit={isEdit} 
          update={setManager} 
          save={handleSave} 
          cancel={()=>setShowConfigModal(false)} 
          handleDelete={handleDelete} />
      </Modal>
    </>
  );
}