import { FormEvent, useRef, useState } from 'react'

type FormState = {
  projectName: string
  respondent: string
  developmentTeamSize: string
  techStack: string
  specialists: string[]
  specialistsOther: string
  frontendLoad: string
  otherTeamLoad: string
  timeConsumingTasks: string
  delayAreas: string[]
  delayAreasOther: string
  mainPains: string
  crossTeamWaitingTasks: string
  selfSufficientTasks: string
  competencyNeeds: Record<string, number | null>
  topCompetencies: string
  expectedEffects: string[]
  expectedEffectsOther: string
  backlogPractice: string
  practiceDirections: string
  backlogExamples: string
  mentorReviewer: string
  risks: string
}

const loadOptions = [
  'Есть существенный свободный ресурс',
  'Есть небольшой резерв',
  'Нормальная загрузка',
  'Высокая загрузка',
  'Критическая загрузка',
]

const specialists = ['Frontend', 'Backend', 'Fullstack', 'QA', 'DevOps', 'Аналитики', 'ML / AI']

const delays = [
  'Frontend',
  'Backend',
  'Согласование API',
  'Архитектура',
  'Аналитика / требования',
  'QA',
  'DevOps / CI/CD',
  'Инфраструктура',
  'Code Review',
  'Релизы',
]

const competencies = [
  'Vue / Angular',
  'Backend',
  'Системная архитектура',
  'Аналитика',
  'DevOps',
  'Автоматизация тестирования',
  'ML / AI',
  'AI-инструменты в SDLC',
]

const effects = [
  'Сокращение time-to-market',
  'Снижение зависимости от других команд',
  'Сокращение количества дефектов',
  'Более быстрые релизы',
  'Сокращение ручной работы',
  'Улучшение требований',
  'Возможность делать end-to-end задачи одним разработчиком',
  'Возможность внедрения AI-функционала',
]

const initial: FormState = {
  projectName: '',
  respondent: '',
  developmentTeamSize: '',
  techStack: '',
  specialists: [],
  specialistsOther: '',
  frontendLoad: '',
  otherTeamLoad: '',
  timeConsumingTasks: '',
  delayAreas: [],
  delayAreasOther: '',
  mainPains: '',
  crossTeamWaitingTasks: '',
  selfSufficientTasks: '',
  competencyNeeds: Object.fromEntries(competencies.map((x) => [x, null])),
  topCompetencies: '',
  expectedEffects: [],
  expectedEffectsOther: '',
  backlogPractice: '',
  practiceDirections: '',
  backlogExamples: '',
  mentorReviewer: '',
  risks: '',
}

function App() {
  const [f, setF] = useState<FormState>(initial)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const topRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setF((v) => ({ ...v, [key]: value }))

  const toggle = (key: 'specialists' | 'delayAreas' | 'expectedEffects', value: string) =>
    set(
      key,
      (f[key].includes(value)
        ? f[key].filter((x) => x !== value)
        : [...f[key], value]) as FormState[typeof key],
    )

  const submit = (e: FormEvent) => {
    e.preventDefault()

    const requiredText = [
      f.projectName,
      f.respondent,
      f.developmentTeamSize,
      f.techStack,
      f.timeConsumingTasks,
      f.mainPains,
      f.crossTeamWaitingTasks,
      f.selfSufficientTasks,
      f.topCompetencies,
      f.practiceDirections,
      f.backlogExamples,
      f.risks,
    ]

    const ratingsOk = Object.values(f.competencyNeeds).every((v) => v !== null)

    if (
      requiredText.some((x) => !x.trim()) ||
      !f.specialists.length ||
      !f.frontendLoad ||
      !f.otherTeamLoad ||
      !f.delayAreas.length ||
      !ratingsOk ||
      !f.expectedEffects.length ||
      !f.backlogPractice ||
      !f.mentorReviewer
    ) {
      setError('Заполните все обязательные вопросы.')
      setResult('')
      topRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setError('')

    const data = {
      questionnaireId: 'teamlead-project-needs-v1',
      questionnaireVersion: 1,
      completedAt: new Date().toISOString(),
      answers: {
        projectName: f.projectName,
        respondent: f.respondent,
        developmentTeamSize: f.developmentTeamSize,
        techStack: f.techStack,
        specialists: [
          ...f.specialists,
          ...(f.specialistsOther.trim() ? [`Другое: ${f.specialistsOther.trim()}`] : []),
        ],
        frontendTeamLoad: f.frontendLoad,
        otherTeamLoad: f.otherTeamLoad,
        timeConsumingTasks: f.timeConsumingTasks,
        delayAreas: [
          ...f.delayAreas,
          ...(f.delayAreasOther.trim() ? [`Другое: ${f.delayAreasOther.trim()}`] : []),
        ],
        mainTechnicalOrProcessPains: f.mainPains,
        crossTeamWaitingTasks: f.crossTeamWaitingTasks,
        tasksPossibleWithAdditionalCompetencies: f.selfSufficientTasks,
        competencyNeeds: {
          vueAngular: f.competencyNeeds['Vue / Angular'],
          backend: f.competencyNeeds.Backend,
          systemArchitecture: f.competencyNeeds['Системная архитектура'],
          analysis: f.competencyNeeds['Аналитика'],
          devops: f.competencyNeeds.DevOps,
          testAutomation: f.competencyNeeds['Автоматизация тестирования'],
          mlAi: f.competencyNeeds['ML / AI'],
          aiToolsInSdlc: f.competencyNeeds['AI-инструменты в SDLC'],
        },
        topThreeCompetencies: f.topCompetencies,
        expectedEffects: [
          ...f.expectedEffects,
          ...(f.expectedEffectsOther.trim() ? [`Другое: ${f.expectedEffectsOther.trim()}`] : []),
        ],
        backlogPracticeAvailability: f.backlogPractice,
        practiceDirections: f.practiceDirections,
        backlogTaskExamples: f.backlogExamples,
        mentorOrReviewerAvailable: f.mentorReviewer,
        constraintsOrRisks: f.risks,
      },
    }

    setResult(JSON.stringify(data, null, 2))
  }

  // Обычная render-функция, а не вложенный React-компонент.
  // Поэтому textarea/input не перемонтируются при каждом введённом символе.
  const text = (label: string, k: keyof FormState, multi = false) => (
    <label className="q">
      <span>
        {label} <b>*</b>
      </span>
      {multi ? (
        <textarea
          value={f[k] as string}
          onChange={(e) => set(k, e.target.value as never)}
        />
      ) : (
        <input
          value={f[k] as string}
          onChange={(e) => set(k, e.target.value as never)}
        />
      )}
    </label>
  )

  const radio = (label: string, k: keyof FormState, options: string[]) => (
    <fieldset className="q">
      <legend>
        {label} <b>*</b>
      </legend>
      <div className="choices">
        {options.map((o) => (
          <label key={o}>
            <input
              type="radio"
              name={String(k)}
              checked={f[k] === o}
              onChange={() => set(k, o as never)}
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  )

  return (
    <main ref={topRef}>
      <header>
        <div className="eyebrow">АНКЕТА 2</div>
        <h1>Тимлид: состояние проекта и потребности</h1>
        <p>
          Цель: понять, где проект теряет время, каких компетенций не хватает, какие навыки
          дадут измеримый эффект и есть ли реальные задачи для практики участников.
        </p>
      </header>

      {error && <div className="error">{error}</div>}

      <form onSubmit={submit}>
        <section>
          <h2>Блок 1. Проект</h2>
          {text('1. Название проекта / продукта', 'projectName')}
          {text('2. Кто заполняет анкету', 'respondent')}
          {text('3. Размер команды разработки', 'developmentTeamSize')}
          {text('4. Основной технологический стек', 'techStack')}

          <fieldset className="q">
            <legend>
              5. Какие специалисты сейчас есть в команде? <b>*</b>
            </legend>
            <div className="choices grid">
              {specialists.map((o) => (
                <label key={o}>
                  <input
                    type="checkbox"
                    checked={f.specialists.includes(o)}
                    onChange={() => toggle('specialists', o)}
                  />
                  {o}
                </label>
              ))}
            </div>
            <input
              placeholder="Другие"
              value={f.specialistsOther}
              onChange={(e) => set('specialistsOther', e.target.value)}
            />
          </fieldset>
        </section>

        <section>
          <h2>Блок 2. Текущее состояние</h2>
          {radio(
            '7. Насколько фронтенд-команда сейчас загружена?',
            'frontendLoad',
            loadOptions,
          )}
          {radio(
            '7. Насколько загружены остальные члены команды?',
            'otherTeamLoad',
            loadOptions,
          )}
          {text(
            '8. Какие типы задач сейчас занимают непропорционально много времени?',
            'timeConsumingTasks',
            true,
          )}

          <fieldset className="q">
            <legend>
              9. Где чаще всего возникают задержки? <b>*</b>
            </legend>
            <div className="choices grid">
              {delays.map((o) => (
                <label key={o}>
                  <input
                    type="checkbox"
                    checked={f.delayAreas.includes(o)}
                    onChange={() => toggle('delayAreas', o)}
                  />
                  {o}
                </label>
              ))}
            </div>
            <input
              placeholder="Другое"
              value={f.delayAreasOther}
              onChange={(e) => set('delayAreasOther', e.target.value)}
            />
          </fieldset>

          {text(
            '10. Назовите три основные технические или процессные боли проекта.',
            'mainPains',
            true,
          )}
          {text(
            '11. Есть ли задачи, которые регулярно ждут специалиста из другой команды/функции? Какие?',
            'crossTeamWaitingTasks',
            true,
          )}
          {text(
            '12. Есть ли задачи, которые разработчики могли бы выполнять самостоятельно при наличии дополнительных компетенций? Какие?',
            'selfSufficientTasks',
            true,
          )}
        </section>

        <section>
          <h2>Блок 3. Дефицит компетенций</h2>

          <div className="q">
            <span>
              13. Насколько проекту нужны дополнительные компетенции внутри команды? <b>*</b>
            </span>
            <p className="hint">
              0 — не требуется; 1 — полезно; 2 — желательно; 3 — существенно; 4 — критично.
            </p>

            <div className="ratings">
              {competencies.map((c) => (
                <div className="rating" key={c}>
                  <span>{c}</span>
                  <div>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <label key={n}>
                        <input
                          type="radio"
                          name={c}
                          checked={f.competencyNeeds[c] === n}
                          onChange={() =>
                            setF((v) => ({
                              ...v,
                              competencyNeeds: { ...v.competencyNeeds, [c]: n },
                            }))
                          }
                        />
                        <i>{n}</i>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {text(
            '14. Какие три компетенции дали бы проекту наибольший эффект?',
            'topCompetencies',
            true,
          )}

          <fieldset className="q">
            <legend>
              15. Какой эффект ожидается? <b>*</b>
            </legend>
            <div className="choices">
              {effects.map((o) => (
                <label key={o}>
                  <input
                    type="checkbox"
                    checked={f.expectedEffects.includes(o)}
                    onChange={() => toggle('expectedEffects', o)}
                  />
                  {o}
                </label>
              ))}
            </div>
            <input
              placeholder="Другое"
              value={f.expectedEffectsOther}
              onChange={(e) => set('expectedEffectsOther', e.target.value)}
            />
          </fieldset>
        </section>

        <section>
          <h2>Блок 4. Практика для участников обучения</h2>
          {radio(
            '20. Есть ли в бэклоге реальные задачи, которые можно дать разработчикам для получения опыта в смежной области?',
            'backlogPractice',
            ['Да', 'Скорее да', 'Пока нет'],
          )}
          {text('21. По каким направлениям такие задачи есть?', 'practiceDirections', true)}
          {text(
            '22. Приведите 2–5 примеров подходящих задач из бэклога.',
            'backlogExamples',
            true,
          )}
          {radio(
            '23. Есть ли на проекте люди, которые могут быть ментором/ревьюером?',
            'mentorReviewer',
            ['Да', 'Возможно', 'Нет'],
          )}
          {text('24. Какие ограничения или риски вы видите?', 'risks', true)}
        </section>

        <button className="primary" type="submit">
          Результат
        </button>
      </form>

      {result && (
        <section className="result">
          <div className="resultHead">
            <h2>Результат JSON</h2>
            <button onClick={() => navigator.clipboard.writeText(result)}>
              Скопировать JSON
            </button>
          </div>
          <pre>{result}</pre>
        </section>
      )}
    </main>
  )
}
export default App
