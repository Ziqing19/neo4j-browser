/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react'

import {
  StyledCode,
  StyledConnectionBody,
  StyledConnectionFooter
} from './styled'

const ConnectedView = ({
  host,
  username,
  storeCredentials,
  hideStoreCredentials = false,
  additionalFooter = null,
  showHost = true
}: any) => {
  return (
    <StyledConnectionBody>
      {username ? (
        <span>
          尊敬的用户 <StyledCode>{username}</StyledCode> ，您已连接到数据库
          <br />
        </span>
      ) : (
        '您已连接到数据库 '
      )}
      {showHost && (
        <span>
          <StyledCode>{host}</StyledCode>
          <br />
        </span>
      )}
      {!hideStoreCredentials && (
        <StyledConnectionFooter>
          登录凭据{storeCredentials ? '' : '没有'}
          被储存在您的浏览器中
        </StyledConnectionFooter>
      )}
      {additionalFooter && (
        <StyledConnectionFooter>{additionalFooter}</StyledConnectionFooter>
      )}
    </StyledConnectionBody>
  )
}
export default ConnectedView
