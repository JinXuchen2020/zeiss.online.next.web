import React from 'react';
import { IQuestionRspModel } from 'models';
import { Typography, Row, Col, Radio, Space, Checkbox } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

export const QuestionItem: React.FunctionComponent<{currentQuestion: IQuestionRspModel, manage: any, disabled?: boolean}> = ({currentQuestion, manage, disabled}) => {
  const { Title } = Typography;

  const optionsElement = () => {
    if (currentQuestion ) {
      const answers = currentQuestion.questionOptions.filter(c=>c.isAnswer)
      if (currentQuestion.type === '单选') {
        return (
          <>
            <Radio.Group value={answers.length > 0 ? answers[0].optionContent : undefined}>
              <Space direction="vertical">
                {currentQuestion.questionOptions.map((option, index) => (
                  <Radio key={index} value={option.optionContent}>{option.optionContent}</Radio>
                ))}
              </Space>
            </Radio.Group>
          </>
        )
      }
      else {
        return (
          <>
            <Checkbox.Group value={answers.map(c => c.optionContent)}>
              <Space direction="vertical">
                {currentQuestion.questionOptions.map((option, index) => (
                  <Checkbox key={index} value={option.optionContent}>{option.optionContent}</Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </>
        )
      }
    }
  }

  return (
    <Row key={currentQuestion.id} onClick={() => manage(currentQuestion)}>
      <Col>
        <Title level={5}>{currentQuestion?.stem}</Title>
        <Paragraph>
          <blockquote>
            {optionsElement()}
          </blockquote>
        </Paragraph>
      </Col>
    </Row>
  )
}