SELECT

t.title,
t.assigned,
t.dueDate,
t.status,
e.supervisor

FROM

task as t
JOIN employee AS e
ON t.assigned = e.id

WHERE

t.status = 'NONSTART'