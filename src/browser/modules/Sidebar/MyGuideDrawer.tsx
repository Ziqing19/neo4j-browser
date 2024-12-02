import { executeCommand } from 'project-root/src/shared/modules/commands/commandsDuck'
import { withBus } from 'react-suber'
import { connect } from 'react-redux'
import React from 'react'
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer/drawer-styled'
import { StyledTable } from 'browser-components/DataTables'
import {
  Link,
  StyledKey,
  StyledValue
} from 'project-root/src/browser/modules/DBMSInfo/styled'
import styled from 'styled-components'

const Form = styled.form``
const FormSection = styled.section`
  margin-bottom: 10px;
`
const Select = styled.select`
  padding: 6px 12px;
  width: 100%;
  height: 30px;
  color: #555;
  border-radius: 4px;
`
const Label = styled.label``
const Input = styled.input`
  height: 30px;
  width: 100%;
  color: #555;
  font-size: 14px;
  margin-top: 2px;
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
`
const Button = styled.button`
  margin-top: 5px;
  width: 100%;
  height: 30px;
  border-radius: 4px;
  color: ${props => props.theme.primaryButtonText};
  background-color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.primary};
  font-family: ${props => props.theme.primaryFontFamily};
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.primary50};
    color: ${props => props.theme.secondaryButtonTextHover};
    border: 1px solid ${props => props.theme.primary50};
  }
`

export const MyGuideDrawer = (props: any): JSX.Element => {
  const options = props.meta.labels ?? ['']
  const [label, setLabel] = React.useState(options[0])
  const [name, setName] = React.useState('')
  const [maxNodes, setMaxNodes] = React.useState(300)

  function handleSearchNodes(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    const cypher = `MATCH (n:${label})-[r]-(m)
WHERE n.name =~ '.*${name}.*'
RETURN n, r, m
LIMIT ${maxNodes}`
    console.log(cypher)
    props.exec(cypher)
  }

  return (
    <Drawer id="my-guide-drawer" data-testid="myGuidesDrawer">
      <DrawerHeader>操作指引</DrawerHeader>
      <DrawerBody>
        <DrawerSection>
          <DrawerSubHeader>快速命令</DrawerSubHeader>
          <DrawerSectionBody>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledKey>展示本体模型</StyledKey>
                  <StyledValue>
                    <Link onClick={() => props.exec(':ont')}>:ont</Link>
                  </StyledValue>
                </tr>
                <tr>
                  <StyledKey>断开数据库</StyledKey>
                  <StyledValue>
                    <Link onClick={() => props.exec(':server disconnect')}>
                      :server disconnect
                    </Link>
                  </StyledValue>
                </tr>
              </tbody>
            </StyledTable>
          </DrawerSectionBody>
        </DrawerSection>
        <DrawerSection>
          <DrawerSubHeader>节点搜索</DrawerSubHeader>
          <DrawerSectionBody>
            <Form onSubmit={handleSearchNodes}>
              <FormSection>
                <Label>
                  节点标签选择
                  <Select
                    value={label}
                    onChange={evt => setLabel(evt.target.value)}
                  >
                    {options.map((option: string) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </Label>
              </FormSection>
              <FormSection>
                <Label>
                  节点名称（部分匹配或留空）
                  <Input
                    value={name}
                    onChange={evt => setName(evt.target.value)}
                  />
                </Label>
              </FormSection>
              <FormSection>
                <Label>
                  最大返回数量（设置栏中进一步配置）
                  <Input
                    value={maxNodes}
                    onChange={evt => setMaxNodes(parseInt(evt.target.value))}
                    type="number"
                    min={0}
                  />
                </Label>
              </FormSection>
              <Button type="submit">提交</Button>
            </Form>
          </DrawerSectionBody>
        </DrawerSection>
      </DrawerBody>
    </Drawer>
  )
}

const mapStateToProps = (state: any) => {
  return {
    meta: state.meta
  }
}

const mapDispatchToProps = (_dispatch: any, ownProps: any) => {
  return {
    exec: (cmd: string) => {
      const action = executeCommand(cmd)
      ownProps.bus.send(action.type, action)
    }
  }
}

export default withBus(
  connect(mapStateToProps, mapDispatchToProps)(MyGuideDrawer)
)
